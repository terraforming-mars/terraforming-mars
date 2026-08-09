# Style Guide

## General
- Formatting is ESLint's job. Run `npm run lint:fix`. This guide covers only what lint can't check.
- Follow the style of the code around the file. If this is a new file, follow the style of the code in the
  directory.

## Utilities
- Before hand-rolling a helper, look in `src/common/utils/utils.ts`. It already has `sum`, `range`,
  `intersection`, `hasIntersection`, `oneWayDifference`, `inplaceRemove`, `partition`, `asArray`, `deNull`,
  `toName`, `toID` and `cast`.
- Prefer `async`/`await` to `.then()`.

## Types, Classes
- Prefer `type` to `interface`. Only use `interface` when it will be used with classes. Interfaces always
  start with `I`.
- Use `undefined`, not `null`. If `null` comes from another API, don't let it escape, use `undefined` or
  something else.

## Collections
- Describe array types as `Array<T>`, not `T[]`.
- Prefer readonly container types — `ReadonlyArray<T>`, `ReadonlySet<T>`, `ReadonlyMap<K, V>`, etc.
- Avoid unnecessary spread operators. Be certain any defensive copy of `[...x]` is necessary.

## Enums, namespaces
- Avoid creating new enums and namespaces. Instead, declare a `const` array of string literals and derive the
  type from it. `src/common/Color.ts` is a good example.

## Imports
- Use `@/` imports in new code. The existing uses of `../` are also fine. Just don't do a wholesale rewrite.
- Avoid inline or dynamic imports.

## Comments
- The first sentence of a comment summarizes the item.
- Comments describe the behavior, not narrate the mechanism. Internal methods and comments might violate that
  as is necessary.
- JSDoc notation makes sense when attaching to a JavaScript element, not as some disjointed separate comment.
- Use `name` to describe variables, methods, parameters, etc.

## Naming
- Types, classes, interfaces are UpperCamelCase.
- Use `maybeDoThis` instead of `doThis` when the method only does the thing _sometimes_.
- Prefer CSS classes in kebab-case. The stylesheets are inconsistent about this, so it's OK to violate this
  if it matches related CSS.

## Tests
- One top-level `describe` per spec file. Nested describes are the exception, not the norm.
- Build games with `testGame`: `const [game, player, player2] = testGame(2, {venusNextExtension: true});`
- Resolve deferred actions with `runAllActions(game)`, then take the next input with `player.popWaitingFor()`.
- Narrow a player input with `cast(input, SelectSpace)` rather than `as`.

## Vue
- In Vue templates, pass boolean props explicitly (`:prop="true"`/`:prop="false"`), never the bare
  attribute-presence shorthand.
- `<script setup>` is preferred for new components. The Options API with `defineComponent` is still fine —
  it's what most of the codebase uses — so write that if it's what you're comfortable with.
- `<style scoped>` is a good home for styles that genuinely belong to one component. Be careful not to reach
  for it just to avoid engaging with the shared stylesheets in `src/styles/`.

## Rewriting text people read
- If you rewrite any text that someone will read, it is probably already translated. Changing it likely
  breaks those translations.
- Nothing catches this for you, so be careful.

## Escape hatches
- Do not use the non-null assertion `!`. It is an ESLint error in `src`, and is only allowed in tests.
  Narrowing with an `if` is usually the best answer.
- Do not add `eslint-disable` comments. There is exactly one in the codebase; let's keep it that way.
