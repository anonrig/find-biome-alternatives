## Find Biome Alternative

Fetches the slowest 100 eslint rules in your path and gives you Biome equivalents

```sh
❯ npx find-biome-alternatives --cwd=../sentry --cmd='yarn eslint static/app' --cache
┌  Using cache available at /Users/yagiz/coding/suggest-biome-rules/.biome-rule-cache
│
◇  Fetching markdown took 74.631667ms
│
└  Here are the rules matching your slowest 100 Eslint rules

┌─────────┬──────────────────────────────┬─────────────────────────────┐
│ (index) │ eslint                       │ biome                       │
├─────────┼──────────────────────────────┼─────────────────────────────┤
│ 0       │ 'no-unreachable'             │ 'noUnreachable'             │
│ 1       │ 'no-dupe-keys'               │ 'noDuplicateObjectKeys'     │
│ 2       │ 'no-obj-calls'               │ 'noGlobalObjectCalls'       │
│ 3       │ 'no-fallthrough'             │ 'noFallthroughSwitchClause' │
│ 4       │ 'no-constant-condition'      │ 'noConstantCondition'       │
│ 5       │ 'no-extra-boolean-cast'      │ 'noExtraBooleanCast'        │
│ 6       │ 'no-shadow-restricted-names' │ 'noShadowRestrictedNames'   │
│ 7       │ 'prefer-const'               │ 'useConst'                  │
│ 8       │ 'no-self-compare'            │ 'noSelfCompare'             │
└─────────┴──────────────────────────────┴─────────────────────────────┘
```
