import child_process from 'node:child_process'
import { parseArgs, promisify } from 'node:util'
import path from 'node:path'
import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'

import * as prompts from '@clack/prompts'

const exec = promisify(child_process.exec)

const {
  values,
} = parseArgs({
  options: {
    cmd: {
      type: 'string',
      default: 'eslint .',
    },
    limit: {
      type: 'string',
      default: '100',
    },
    cwd: {
      type: 'string',
      default: process.cwd(),
    },
    cache: {
      type: 'boolean',
      default: false,
    }
  }
})

const cache_path = path.resolve('./.biome-rule-cache')
const cache_exist = existsSync(cache_path)
const eslint_command = `TIMING=${values.limit} ${values.cmd}`;

let raw_data

if (values.cache && cache_exist) {
  prompts.intro(`Using cache available at ${cache_path}`)
  raw_data = await fs.readFile(cache_path, 'utf8')
} else {
  prompts.intro(`Cache is not available`)

  {
    const spinner = prompts.spinner();
    spinner.start(`Running "${eslint_command}"`)
    const t0 = performance.now()
    const output = await exec(eslint_command, {
      encoding: 'utf8',
      cwd: path.resolve(values.cwd),
    })
    raw_data = output.stdout
    const t1 = performance.now()
    spinner.stop(`Command took ${t1 - t0}ms`)
    await fs.writeFile(cache_path, raw_data, 'utf8')
  }
}

let most_time_consuming_rules = []

{
  let rows = raw_data.split('\n')
  let start = rows.findIndex(row => row.startsWith('$ '))
  rows = rows.slice(start + 3)
  rows.pop()
  most_time_consuming_rules = rows.map(row => row.split(' ')[0])
}

let biome_rules_raw = []

{
  const markdown_url = 'https://raw.githubusercontent.com/biomejs/biome/main/website/src/content/docs/linter/rules-sources.mdx'
  const spinner = prompts.spinner()
  spinner.start('Fetching Biome rule mappings')
  const t0 = performance.now()
  const out = await fetch(markdown_url, {
    method: 'GET'
  })
  const t1 = performance.now()
  spinner.stop(`Fetching markdown took ${t1 - t0}ms`)
  const raw_text = await out.text()
  biome_rules_raw = raw_text.slice(4).split('\n')
}

let regexp = /\[(.*?)\]/g
let matched_rules = most_time_consuming_rules.flatMap(rule => {
  const matched = biome_rules_raw.find(line => line.includes(`[${rule}]`))
  if (!matched) {
    return []
  }

  return {
    eslint: rule,
    biome: matched.match(regexp).at(-1).slice(1, -1),
    matched_line: matched,
  }
})

prompts.outro(`Here are the rules matching your slowest ${values.limit} Eslint rules`)
console.table(matched_rules, ['eslint', 'biome'])
