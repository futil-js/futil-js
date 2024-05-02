> **NOTE** This file is generated from jsdoc, do not edit directly. Instead, run `npm run docs`

<a href='https://futil-js.github.io/futil-js/'><img src='https://user-images.githubusercontent.com/8062245/28718527-796382ac-7374-11e7-98a3-9791223042a4.png' width='200' alt='futil-js'></a>

---

[![npm version](https://badge.fury.io/js/futil-js.svg)](https://badge.fury.io/js/futil-js)
![dependencies](https://david-dm.org/futil-js/futil-js.svg)
[![Code Climate](https://codeclimate.com/github/futil-js/futil-js/badges/gpa.svg)](https://codeclimate.com/github/futil-js/futil-js)
[![Coverage Status](https://coveralls.io/repos/github/futil-js/futil-js/badge.svg?branch=master)](https://coveralls.io/github/futil-js/futil-js?branch=master)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Try futil-js on RunKit](https://badge.runkitcdn.com/futil-js.svg)](https://npm.runkit.com/futil-js)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/futil.svg)](https://saucelabs.com/u/futil)

A collection of F(unctional) Util(ities). Resistance is futile.

Mostly, these are generic utilities that could conceivably be part of a library like [lodash/fp](https://github.com/lodash/lodash/wiki/FP-Guide), but for one reason or another are not.

# Docs

https://futil-js.github.io/futil-js/

# Version History/Changelog

See our [changelog](https://github.com/futil-js/futil-js/blob/master/CHANGELOG.md)

# Installing

`npm i -S futil`
or
`npm i -S futil-js`

This package requires `lodash/fp`, so make sure that's available in your app.

# Usage

`import * as F from 'futil'`
or
`import F from 'futil'`
or
`import {x,y,z} from 'futil'`

# API

## Async

### promiseProps

`{ a: Promise, b: Promise} => Promise<{a: value, b: value}>`
Like `Promise.all`, but for objects. Polyfill bluebird Promise.props. Takes an object with promise values and returns a promise that resolves with an object with resolved values instead.

### flowAsync

`(f1, f2, ...fn) -> (...args) => fn(f2(f1(...args)))`
Like `_.flow`, but supports flowing together async and non async methods.
If nothing is async, it _stays synchronous_.
Also, it handles awaiting arrays of promises (e.g. from _.map) with `Promise.all` and objects of promises (e.g. from _.mapValues) with `promiseProps`.
This method generally solves most issues with using futil/lodash methods asynchronously. It's like magic!
NOTE: Main gotchas are methods that require early exit like `find` which can't be automatically async-ified. Also does not handle promises for keys.
Use `F.resolveOnTree` to await more complexly nested promises.

### flowAsyncDeep

`(f1, f2, ...fn) -> (...args) => fn(f2(f1(...args)))`
Just like `F.flowAsync`, except it recurses through return values using `F.resolveOnTree` instead of just `Promise.all` or `promise.props`
_CAUTION_ Just like `resolveOnTree`, this will mutate intermediate results to resolve promises. This is generally safe (and more performant) but might not always be what you expect.

## Function

### maybeCall

`(fn, a, b) -> fn(a, b)`
If `fn` is a function, call the function with the passed-in arguments. Otherwise, return `false`.

### callOrReturn

`(fn, a, b) -> fn(a, b)`
If `fn` is a function, call the function with the passed-in arguments. Otherwise, return `fn`.

### boundMethod

`(a, Monoid f) -> f[a] :: f a`
Binds a function of an object to it's object.

### converge

`(f, [g1, g2, ...gn]) -> a -> f([g1(a), g2(a), ...])`
http://ramdajs.com/docs/#converge. Note that `f` is called on the array of the return values of `[g1, g2, ...gn]` rather than applied to it.

### comply (alias: composeApply)

`(f, g) -> x -> f(g(x))(x)`
A combinator that combines compose and apply. `f` should be a 2 place curried function. Useful for applying comparisons to pairs defined by some one place function, e.g. `var isShorterThanFather = F.comply(isTallerThan, fatherOf)`

### defer

Implement `defer`, ported from bluebird docs and used by debounceAsync

### debounceAsync

A `_.debounce` for async functions that ensure the returned promise is resolved with the result of the execution of the actual call. Using `_.debounce` with `await` or `.then` would result in the earlier calls never returning because they're not executed - the unit tests demonstate it failing with `_.debounce`.

### flurry

`(f1, f2, ...fn) -> f1Arg1 -> f1Arg2 -> ...f1ArgN -> fn(f2(f1))`
Flurry is combo of flow + curry, preserving the arity of the initial function. See https://github.com/lodash/lodash/issues/3612.

### uncurry

`(arg -> arg -> arg) -> (arg, arg, arg)`
Uncurry allows curried functions to be called with all its arguments at once. Methods curried with lodash or ramda support this call style out of the box, but hand curried methods. This can happen as the result of function composition.

### recurry

`(n, fn) -> fn(arg1, ...argN)`
Resets curry arity. Useful in scenarios where you have a curried function whose arity isn't detectable by a lodash or ramda curry - such as one constructed via function composition.

### mapArgs

`(mapper, fn) -> (...args) -> fn(...args.map(mapper))`
Returns a function that applies the mapping operation to all of the arguments of a function. Very similar to \_.overArgs, but runs a single mapper on all of the args args.

## Iterators

### differentLast

`handleItem -> handleLastItem -> iterator`
Creates an iterator that handles the last item differently for use in any function that passes `(value, index, list)` (e.g. `mapIndexed`, `eachIndexed`, etc). Both the two handlers and the result are iterator functions that take `(value, index, list)`.

## Logic

### overNone

`([f1, f2, ...fn]) -> !f1(x) && !f2(x) && ...!fn(x)`
Creates a function that checks if none of the array of predicates passed in returns truthy for `x`

### ifElse

`(condition, onTrue, onFalse, ...x) -> (T(condition)(...x) ? onTrue(...x) : onFalse(...x))`
http://ramdajs.com/docs/#ifElse. The transform function T supports passing a boolean for `condition` as well as any valid argument of `_.iteratee`, e.g. `myBool = applyTest(x); F.ifElse(myBool, doSomething, doSomethingElse);`

### when

`(condition, onTrue, ...x) -> (T(condition)(...x) ? onTrue(...x) : _.identity(...x))`
http://ramdajs.com/docs/#when. `T` extends `_.iteratee` as above.

### unless

`(condition, onFalse, ...x) -> (T(condition)(...x) ? _.identity(...x) : onFalse(...x))`
http://ramdajs.com/docs/#unless. `T` extends `_.iteratee` as above.

### whenTruthy

`when` curried with `Boolean`

### whenExists

`when` curried with `exists`

### unlessTruthy

`unless` curried with `Boolean`

## Collection

### flowMap

`[f1, f2, ...fn] -> _.map(_.flow(fn))`
Maps a flow of `f1, f2, ...fn` over a collection.

### findApply

`f -> x -> f(find(f, x))`
A version of `find` that also applies the predicate function to the result. Useful when you have an existing function that you want to apply to a member of a collection that you can best find by applying the same function.

### map

`(a -> b) -> [a] -> [b]`
Maps a function over an iterable. Works by default for Arrays and Plain Objects.

### deepMap

`(a -> b) -> [a] -> [b]`
Maps a function over a recursive iterable. Works by default for nested Arrays, nested Plain Objects and mixed nested Arrays and Plain Objects. Also works for any other iterable data type as long as two other values are sent: a mapping function, and a type checker (See the unit tests for deepMap).

### insertAtIndex

`(index, val, array|string) -> array|string`
Inserts value into an array or string at `index`

Example:

```jsx
(1, '123', 'hi') -> 'h123i'
```

### compactMap

`(fn, collection) -> collection`
Maps `fn` over the input collection and compacts the result.

### sizeBy

`(fn, collection) -> number`
Returns the size of a collection after filtering by `fn`.

## Convert(\_In)

lodash/fp is great, but sometimes the curry order isn't exactly what you want.

These methods provide alternative orderings that are sometimes more convenient.

The idea of `In` methods is to name them by convention, so when ever you need a method that actually takes the collection first (e.g. a `get` where the data is static but the field is dynamic), you can just add `In` to the end (such as `getIn` which takes the object first)

### getIn

Just like `_.get`, but with `{rearg: false}` so the argument order is unchanged from non fp lodash.

### hasIn

Just like `_.has`, but with `{rearg: false}` so the argument order is unchanged from non fp lodash.

### pickIn

Just like `_.pick`, but with `{rearg: false}` so the argument order is unchanged from non fp lodash.

### includesIn

Just like `_.includes`, but with `{rearg: false}` so the argument order is unchanged from non fp lodash.

## Convert(\_On)

lodash/fp likes to keep things pure, but sometimes JS can get pretty dirty.

These methods are alternatives for working with data that--for whatever the use case is--needs to be mutable

Any methods that interact with mutable data will use the `On` convention (as it is some action occuring `On` some data)

### extendOn

Just like `_.extend`, but with `{mutable: true}` so it mutates.

### defaultsOn

Just like `_.defaults`, but with `{mutable: true}` so it mutates.

### mergeOn

Just like `_.merge`, but with `{mutable: true}` so it mutates.

### setOn

Just like `_.set`, but with `{mutable: true}` so it mutates.

### unsetOn

Just like `_.unset`, but with `{mutable: true}` so it mutates.

### pullOn

Just like `_.pull`, but with `{mutable: true}` so it mutates.

### updateOn

Just like `_.update`, but with `{mutable: true}` so it mutates.

## Convert(\_Indexed)

lodash/fp caps iteratees to one argument by default, but sometimes you need the index.

These methods are uncapped versions of lodash's methods.

Any method with uncapped iteratee arguments will use the `Indexed` convention.

### mapIndexed

Just like `_.map`, but with `{cap: false}` so iteratees are not capped (e.g. indexes are passed).

### findIndexed

Just like `_.find`, but with `{cap: false}` so iteratees are not capped (e.g. indexes are passed).

### eachIndexed

Just like `_.each`, but with `{cap: false}` so iteratees are not capped (e.g. indexes are passed).

### reduceIndexed

Just like `_.reduce`, but with `{cap: false}` so iteratees are not capped (e.g. indexes are passed).

### pickByIndexed

Just like `_.pickBy`, but with `{cap: false}` so iteratees are not capped (e.g. indexes are passed).

### omitByIndexed

Just like `_.omitBy`, but with `{cap: false}` so iteratees are not capped (e.g. indexes are passed).

### mapValuesIndexed

Just like `_.mapValues`, but with `{cap: false}` so iteratees are not capped (e.g. indexes are passed).

## Array

### compactJoin

`joinString -> [string1, string2, ...stringN] -> string1 + joinString + string2 + joinString ... + stringN`
Joins an array after compacting. Note that due to the underlying behavior of `_.curry` no default `join` value is supported -- you must pass in some string with which to perform the join.

### dotJoin

`[string1, string2, ...stringN] -> string1 + '.' + string2 + '.' ... + stringN`
Compacts and joins an array with `.`

### dotJoinWith

`filterFunction -> [string1, string2, ...stringN] -> string1 + '.' + string2 + '.' ... + stringN`
Compacts an array by the provided function, then joins it with `.`

### repeated

`[a] -> [a]`
Returns an array of elements that are repeated in the array.

### push

`(val, array) -> array`
Return `array` with `val` pushed.

### moveIndex

`(from, to, array) -> array`
Moves a value from one index to another

### mergeRanges

`([[], [], []]) -> [[], []]`
Takes any number of ranges and return the result of merging them all.

Example:

```jsx
[[0,7], [3,9], [11,15]] -> [[0,9], [11,15]]
```

### isSubset

`([a], [a]) -> boolean`
Determines if an array is a subset of another array.

### cycle

`[a, b...] -> a -> b`
Creates a function that takes an element of the original array as argument and returns the next element in the array (with wrapping). Note that (1) This will return the first element of the array for any argument not in the array and (2) due to the behavior of `_.curry` the created function will return a function equivalent to itself if called with no argument.

### arrayToObject

`(k, v, [a]) -> { k(a): v(a) }`
Creates an object from an array by generating a key/value pair for each element in the array using the key and value mapper functions.

### keysToObject

`(v, [a]) => { a: v(a) }`
Converts and array of keys to an object using a predicate

### zipObjectDeepWith

A version of `_.zipObjectDeep` that supports passing a function to determine values intead of an array, which will be invoked for each key.

### flags

`[a, b] -> {a:true, b:true}`
Converts an array of strings into an object mapping to true. Useful for optimizing `includes`.

### prefixes

`['a', 'b', 'c'] -> [['a'], ['a', 'b'], ['a', 'b', 'c']]`
Returns a list of all prefixes. Works on strings, too. Implementations must guarantee that the orginal argument has a length property.

### encoder

`string -> {encode: array -> string, decode: string -> array}`
Creates an object with encode and decode functions for encoding arrays as strings. The input string is used as input for join/split.

### dotEncoder

`{ encode: ['a', 'b'] -> 'a.b', decode: 'a.b' -> ['a', 'b'] }`
An encoder using `.` as the separator

### slashEncoder

`{ encode: ['a', 'b'] -> 'a/b', decode: 'a/b' -> ['a', 'b'] }`
An encoder using `/` as the separator

### chunkBy

`(([a], a) -> Boolean) -> [a] -> [[a]]`
Takes a predicate function and an array, and returns an array of arrays where each element has one or more elements of the original array. Similar to Haskell's [groupBy](http://zvon.org/other/haskell/Outputlist/groupBy_f.html).

The predicate is called with two arguments: the current group, and the current element. If it returns truthy, the element is appended to the current group; otherwise, it's used as the first element in a new group.

### chunkByValue

`f -> [] -> [[], ...]`
`chunkBy` when the returned value of an iteratee changes

### toggleElementBy

`bool -> value -> list -> newList`
Just like toggleElement, but takes an iteratee to determine if it should remove or add. This is useful for example in situations where you might have a checkbox that you want to represent membership of a value in a set instead of an implicit toggle. Used by includeLens.

### toggleElement

`(any, array) -> array`
Removes an element from an array if it's included in the array, or pushes it in if it doesn't. Immutable (so it's a clone of the array).

### intersperse

`f -> array -> [array[0], f(), array[n], ....)`
Puts the result of calling `f` in between each element of the array. `f` is a standard lodash iterator taking the value, index, and list. If `f` is not a function, it will treat `f` as the value to intersperse. See https://ramdajs.com/docs/#intersperse.

Example:

```jsx
// Example with words (toSentence is basically this flowed into a `_.join('')`):
F.intersperse(
  differentLast(
    () => 'or',
    () => 'or perhaps'
  ),
  ['first', 'second', 'third']
)
// ['first', 'or', 'second', 'or perhaps', 'third']

// Example with React and JSX:
let results = [1, 2, 3]
return (
  <div>
    <b>Results:</b>
    <br />
    {_.flow(
      _.map((x) => <b>{x}</b>),
      F.intersperse(
        F.differentLast(
          () => ', ',
          () => ' and '
        )
      )
    )(results)}
  </div>
)
// Output:
// **Results:**
// **1**, **2** and **3**.
```

**Note:** This works great with the `differentLast` iterator. Also, `intersperse` can be used with JSX components!

### replaceElementBy

`(fn(array_element), value, array) -> array`
Replaces an element in an array with `value` based on the boolean result of a function `fn`.

### replaceElement

`(target, value, array) -> array`
Replaces all elements equal to `target` in an array with `value`.

## Object

### singleObject

`(k, v) -> {k: v}`
Creates an object with a key and value.

### singleObjectR

`(v, k) -> {k: v}`
Flipped version of `singleObject`.

### chunkObject

`({a, b}) -> [{a}, {b}]`
Breaks an object into an array of objects with one key each.

### compactObject

Remove properties with falsey values.

Example:

```jsx
({ a: 1, b: null, c: false }) -> {a:1}
```

### isEmptyObject

Check if the variable is an empty object (`{}`).

### isNotEmptyObject

Check if the variable is **not** an empty object (`{}`).

### stripEmptyObjects

Omit properties whose values are empty objects.

Example:

```jsx
{ a:1, b:{}, c:2 } -> {a:1, c:2}
```

**Note:** (_TODO_ rename to `omitEmptyObjects`)

### pickInto

_TODO_

### renameProperty

`sourcePropertyName -> targetPropertyName -> sourceObject -> sourceObject`
Rename a property on an object.

Example:

```jsx
renameProperty('a', 'b', { a: 1 }) -> { b: 1 }
```

### renamePropertyOn

`sourcePropertyName -> targetPropertyName -> sourceObject -> sourceObject`
Rename a property on an object.
**NOTE**:Mutates the object

Example:

```jsx
renamePropertyOn('a', 'b', { a: 1 }) -> { b: 1 }
```

### popProperty

`k -> { k: v } -> v`
Removes a property from an object and returns the removed value.
Like `F.unsetOn`, but returns the removed value instead of the mutated object. Similar to .pop() on arrays, but for objects.
Supports nested properties using dot notation.
NOTE: Mutates the object. If you don't want mutation, you probably want `_.unset` for the object or `_.get` for the value.

### unwind

`k -> { k: [a, b] } -> [{ k: a }, { k: b }]`
Just like mongo's `$unwind`: produces an array of objects from an object and one of its array-valued properties. Each object is constructed from the original object with the array value replaced by its elements. Unwinding on a nonexistent property or a property whose value is not an array returns an empty array.

Example:

```jsx
F.unwind('b', [{ a: true, b: [1, 2] }])
//=> [{ a: true, b: 1 }, { a: true, b: 2 }]
```

### unwindArray

`k -> [{ k: [a, b] }] -> [{ k: a }, { k: b }]`
Unwinds an array of objects instead of a single object, as you might expect if you're used to mongo's `$unwind`. Alias for `(key, data) => _.flatMap(F.unwind(key), data)`

Example:

```jsx
F.unwindArray('b', [
  { a: true, b: [1, 2] },
  { a: false, b: [3, 4] },
])
//=> [
//=>  { a: true, b: 1 },
//=>  { a: true, b: 2 },
//=>  { a: false, b: 3 },
//=>  { a: false, b: 4 },
//=> ]
```

### flattenObject

Flatten an object with the paths for keys.

Example:

```jsx
{ a: { b: { c: 1 } } } => { 'a.b.c' : 1 }
```

### unflattenObject

Unlatten an object with the paths for keys.

Example:

```jsx
{ 'a.b.c' : 1 } => { a: { b: { c: 1 } } }
```

### matchesSignature

Returns true if object keys are only elements from signature list. (but does not require all signature keys to be present)

### matchesSome

Similar to `_.matches`, except it returns true if 1 or more object properties match instead of all of them. See https://github.com/lodash/lodash/issues/3713.

### compareDeep

Checks if an object's property is equal to a value.

### mapProp

_Deprecated in favor of lodash `update`_ Applies a map function at a specific path

Example:

```jsx
mapProp(double, 'a', {a: 2, b: 1}) -> {a: 4, b: 1}
```

### getOrReturn

`_.get` that returns the target object if lookup fails

### alias

`_.get` that returns the prop if lookup fails

### aliasIn

Flipped `alias`

### cascade

A `_.get` that takes an array of paths (or functions to return values) and returns the value at the first path that matches. Similar to `_.overSome`, but returns the first result that matches instead of just truthy (and supports a default value)

### cascadeIn

Flipped cascade

### cascadeKey

A `_.get` that takes an array of paths and returns the first path that matched

### cascadePropKey

A `_.get` that takes an array of paths and returns the first path that exists

### cascadeProp

A `_.get` that takes an array of paths and returns the first value that has an existing path

### unkeyBy

`newKey -> {a:x, b:y} -> [{...x, newKey: a}, {...y, newKey: b}]`
Opposite of `_.keyBy`. Creates an array from an object where the key is merged into the values keyed by `newKey`.

Example:

```jsx
F.unkeyBy('_key')({ a: { status: true}, b: { status: false }) -> [{ status: true, _key: 'a' }, { status: false, _key: 'b' }]
```

**Note:** Passing a falsy value other than `undefined` for `newKay` will result in each object key being pushed into its corresponding return array member with itself as value, e.g. `F.unkeyBy('')({ a: { status: true}, b: { status: false }) -> [{ status: true, a: 'a' }, { status: false, b: 'b' }]`. Passing `undefined` will return another instance of F.unkeyBy.

### simpleDiff

`(from, to) -> simpleDiff`
Produces a simple flattened (see `flattenObject`) diff between two objects. For each (flattened) key, it produced a `from` and a `to` value. Note that this will omit any values that are not present in the deltas object.

### simpleDiffArray

`(from, to) -> [simpleDiffChanges]`
Same as `simpleDiff`, but produces an array of `{ field, from, to }` objects instead of `{ field: { from, to } }`

### diff

`(from, to) -> diff`
Same as `simpleDiff`, but also takes in count deleted properties.
**Note:** We're considering not maintaining this in the long term, so you might probably have more success with any existing library for this purpose.

### diffArray

`(from, to) -> [diffChanges]`
Same as `simpleDiffArray`, but also takes in count deleted properties.
**Note:** We're considering not maintaining this in the long term, so you might probably have more success with any existing library for this purpose.

### pickOn

A `_.pick` that mutates the object

### mergeAllArrays

Like `_.mergeAll`, but concats arrays instead of replacing. This is basically the example from the lodash `mergeAllWith` docs.

### invertByArray

`{ a: [x, y, z], b: [x] } -> { x: [a, b], y: [a], z: [a] }`
Similar to `_.invert`, but expands arrays instead of converting them to strings before making them keys.

### stampKey

`key -> { a: { x: 1 }, b: { y: 2 } } -> { a: { x: 1, key: 'a' }, b: { y: 2, key: 'b' } }`
Iterates over object properties and stamps their keys on the values in the field name provided.

### omitNil

`_.omitBy` using `_.isNil` as function argument.

### omitNull

`_.omitBy` using `_.isNull` as function argument.

### omitBlank

`_.omitBy` using `F.isBlank` as function argument.

### omitEmpty

`_.omitBy` using `_.isEmpty` as function argument.

### mergeOverAll

`([f, g], ...args) -> {...f(...args), ...g(...args)}`
Composition of `_.over` and `_.mergeAll`. Takes an array of functions and an arbitrary number of arguments, calls each function with those arguments, and merges the results. Can be called with `mergeOverAll([f, g], x, y)` or `mergeOverAll([f, g])(x, y)`.
**Note:** For functions that do not return objects, `_.merge`'s behavior is followed: for strings and arrays, the indices will be converted to keys and the result will be merged, and for all other primitives, nothing will be merged.

### mergeOverAllWith

`(customizer, [f, g], ...args) -> {...f(...args), ...g(...args)}`
A customizable `mergeOverAll` that takes a function of the form `(objValue, srcValue) -> newValue` as its first argument; see [`_.mergeWith`](https://lodash.com/docs/latest#mergeWith). Both the customizer and array of functions can be partially applied.

### mergeOverAllArrays

`([f, g], ...args) -> {...f(...args), ...g(...args)}`
A customized `mergeOverAll` that applies the array-merging behavior of `mergeAllArrays`.

### getWith

`(x -> y) -> k -> {k: x} -> y`
Like `_.get`, but accepts a customizer function which is called on the value to transform it before it is returned. Argument order is `(customizer, path, object)`.

### expandObject

`(transform: obj -> newObj) -> obj -> { ...obj, ...newObj }`
Accepts a transform function and an object. Returns the result of applying the transform function to the object, merged onto the original object. `expandObject(f, obj)` is equivalent to `mergeOverAll([_.identity, f], obj)`.

### expandObjectBy

`key -> (transform: x -> newObj) -> (obj: { key: x }) -> { ...obj, ...newObj }`
Expands an object by transforming the value at a single key into a new object, and merging the result with the original object. Similar to `expandObject`, but the argument order is `(key, transform, object)`, and the transform function is called on the value at that key instead of on the whole object.

### commonKeys

`(x, y) -> [keys]`
Takes two objects and returns the keys they have in common

### firstCommonKey

`(x, y) -> key`
Takes two objects and returns the first key in `y` that x also has

### updateIfExists

`(path, updater, object) -> object`
Like `_.update`, but does not call the iteratee if the path is missing on the object

### updateIfExistsOn

`(path, updater, object) -> object`
Like `F.updateOn`, but does not call the iteratee if the path is missing on the object
_Mutates_ the object

### updatePathsOn

`({ path: transform }, target) -> obj`
Similar to ramda's `R.evolve`, but supports lodash iteratees and nested paths.
Applies transforms to the target object at each path. The transform function is called with the value at that path, and the result is set at that path.
Transforms are **not** called for paths that do not exist in the target object.
Transform functions support lodash iteratee shorthand syntax.
Deep paths are supported by nesting objects and by dotted the keys

Note: _Mutates_ the target object for performance. If you don't want this, use `updatePaths` or clone first.

### updateAllPathsOn

`({ path: transform }, target) -> obj`
Similar to ramda's `R.evolve`, but supports lodash iteratees and nested paths.
Applies transforms to the target object at each path. The transform function is called with the value at that path, and the result is set at that path.
Transforms **are** called for paths that do not exist in the target object.
Transform functions support lodash iteratee shorthand syntax.
Deep paths are supported by nesting objects and by dotted the keys

Note: _Mutates_ the target object for performance. If you don't want this, use `updateAllPaths` or clone first.

### updateAllPaths

`({ path: transform }, target) -> obj`
Similar to ramda's `R.evolve`, but supports lodash iteratees and nested paths.
Applies transforms to the target object at each path. The transform function is called with the value at that path, and the result is set at that path.
Transforms **are** called for paths that do not exist in the target object.
Transform functions support lodash iteratee shorthand syntax.
Deep paths are supported by nesting objects and by dotted the keys

_Note_ Deep clones prior to executing to avoid mutating the target object, but mutates under the hood for performance (while keeping it immutable at the surface). If you're doing this in a place where mutating is safe, you might want `F.updateAllPathsOn` to avoid the `_.deepClone`

### updatePaths

`({ path: transform }, target) -> obj`
Similar to ramda's `R.evolve`, but supports lodash iteratees and nested paths.
Applies transforms to the target object at each path. The transform function is called with the value at that path, and the result is set at that path.
Transforms are **not** called for paths that do not exist in the target object.
Transform functions support lodash iteratee shorthand syntax.
Deep paths are supported by nesting objects and by dotted the keys

_Note_ Deep clones prior to executing to avoid mutating the target object, but mutates under the hood for performance (while keeping it immutable at the surface). If you're doing this in a place where mutating is safe, you might want `F.updatePathsOn` to avoid the `_.deepClone`

### matchesBy

`(criteria: object, object: object) -> boolean`
Takes a criteria object and an object to test against it, and returns true if all the values in the criteria match the values in the object
Criteria values can be functions or values to compare against
Supports dot notation for deep paths

### matchesBySome

`(criteria: object, object: object) -> boolean`
Takes a criteria object and an object to test against it, and returns true if some of the values in the criteria match the values in the object
Criteria values can be functions or values to compare against
Supports dot notation for deep paths

## String

### wrap

`(pre, post, content) -> pre + content + post`
Wraps a string with pre and post unless content is nil (and replaces )

### parens

`'asdf' -> '(asdf)'`
Wraps a string in parenthesis.

### trimStrings

Maps `_.trim` through all the strings of a given object or array.

### autoLabel

`string -> string`
Converts strings like variable names to labels (generally) suitable for GUIs, including support for acronyms and numbers. It's basically `_.startCase` with acronym and number support.

### autoLabelOption

`string -> {value:string, label:string}`
Creates a `{value, label}` which applies `autoLabel` the string parameter on puts it on the label property, with the original on the value property. You can also pass in an object with value or with both value and label.

### autoLabelOptions

`[string] -> [{value:string, label:string}]`
Applies `autoLabelOption` to a collection. Useful for working with option lists like generating select tag options from an array of strings.

### toSentenceWith

`(separator, lastSeparator, array) => string`
Just like `toSentence`, but with the ability to override the `separator` and `lastSeparator`

Example:

```jsx
(' - ', ' or ', ['a', 'b', 'c']) -> 'a - b or c'
```

### toSentence

`array => string`
Joins an array into a human readable string. See https://github.com/epeli/underscore.string#tosentencearray-delimiter-lastdelimiter--string

Example:

```jsx
['a', 'b', 'c'] -> 'a, b and c'
```

### uniqueStringWith

`(fn, array) -> string -> string`
Allows passing a "cachizer" function (`array -> object`) to override the way `uniqueString`'s initial array is converted into a cache object. Can be curried to create a custom `uniqueString` function, eg: `let myUniqueString = uniqueStringWith(myFunc)`

Like `uniqueString`, the resulting deduplication function exposes `cache` and `clear()` properties.

Example:

```jsx
let uniqueStringStripDigits = uniqueStringWith(
  _.countBy(_.replace(/(\d+)$/, ''))
)
let dedupe = uniqueStringStripDigits(['foo', 'foo42', 'foo3000'])
dedupe('foo') //-> 'foo3'
uniqueStringWith(_.identity, dedupe.cache)('foo') //-> 'foo4'
```

### uniqueString

`array -> string -> string`
Returns a function that takes a string and de-duplicates it against an internal cache. Each time this function is called, the resulting deduplicated string is added to the cache. Exposes `cache` and `clear()` properties to read and clear the cache, respectively.

Example:

```jsx
let dedupe = uniqueString()
_.map(dedupe, ['foo', 'foo', 'foo']) //-> ['foo', 'foo1', 'foo2']
dedupe.cache //-> { foo: 3, foo1: 1, foo2: 1 }
dedupe.clear()
dedupe.cache //-> {}
dedupe('foo') //-> 'foo'
```

### crunchWhitespace

`string -> string`
Replaces whitespace substrings with a single space and trims leading/trailing whitespace

## Regex

### testRegex

`regex -> string -> bool`
Just like ramda test, creates a function to test a regex on a string.

### makeRegex

`options:string -> string -> regex`
A curried implementation of `RegExp` construction.

### makeAndTest

`options:string -> string -> (string -> bool)`
Makes and tests a RegExp with makeRegex and testRegex.

### matchAllWords

`string -> string -> bool`
Returns true if the second string matches all of the words in the first string.

### matchAnyWord

`string -> string -> bool`
Returns true if the second string matches any of the words in the first string.

### allMatches

`regex -> string -> [{text: string, start: number, end: number}]`
Returns an array of matches with start/end data

Example:

```jsx
F.allMatches(/a/g, 'vuhfaof') -> [ { text: 'a', start: 4, end: 5 } ]
```

### postings

`regex -> string -> [[number, number]]`
Returns an array of postings (position ranges) for a regex and string to test, e.g. `F.postings(/a/g, 'vuhfaof') -> [[4, 5]]`

### postingsForWords

`words -> string -> [[[number, number]]]`
Takes a string of words and a string to test, and returns an array of arrays of postings for each word.

Example:

```jsx
F.postingsForWords('she lls', 'she sells sea shells')
// [
//   [[0, 3], [14, 17]]
//   [[6, 9], [17, 20]]
// ]
```

### highlight

`start -> end -> pattern -> input -> highlightedInput`
Wraps the matches for `pattern` found in `input` with the strings `start` and `end`. The `pattern` argument can either be a string of words to match, or a regular expression.

Example:

```jsx
let braceHighlight = F.highlight('{', '}')
braceHighlight('l o', 'hello world') //-> "he{llo} w{o}r{l}d"
braceHighlight(/l+\w/, 'hello world') //-> "he{llo} wor{ld}"
```

## Math

### greaterThanOne

`number -> bool`
Returns true if number is greater than one.

## Lang

Language level utilities

### isPromise

`x -> bool`
A utility that checks if the argument passed in is of type promise

### throws

Just throws whatever it is passed.

### tapError

Tap error will run the provided function and then throw the first argument. It's like `_.tap` for rethrowing errors.

### exists (alias: isNotNil)

Negated `_.isNil`

### isMultiple

`(Array<T> | string | {length}) -> bool`
Returns true if the input has a `length` property > 1, such as arrays, strings, or custom objects with a lenth property

### append

`(a, b) => b + a`
A curried, flipped `_.add`. The flipping matters for strings, e.g. `F.append('a')('b') -> 'ba'`

### isBlank

`x -> bool`
Designed to determine if something has a meaningful value, like a ux version of truthiness. It's false for everything except null, undefined, '', [], and {}. Another way of describing it is that it's the same as falsiness except 0 and false are truthy and {} is falsey. Useful for implementing "required" validation rules.

### isNotBlank

`x -> bool`
Opposite of `isBlank`

### isBlankDeep

`f -> x -> bool`
Recurses through an object's leaf properties and passes an array of booleans to the combinator, such as `_.some`, `_.every`, and `F.none`

## Lens

A lens is a getter and setter pair. You use them to write code that needs to read _and_ write a value (like a method to flip a boolean switch, or a React component that reads and writes some state) without worrying about the implementation.

Functions that operate on lenses can handle a few different "shorthand" structures. This is similar to lodash's `_.iteratee` (which allows their methods to treat strings, objects, or functions as shorthand predicates)

A lens can be any of these formats:

`({ get, set })`
An object with a `get` function and `set` function.
Found in: MobX "boxed observables"
Example Usage: `F.flip({ get, set })`

`([value, setter])`
An array of the `value` and a `setter` function to change it.
Found in: React's useState hook
Example Usage: `F.flip([value, setter])`

`(lookup, object)`
A lookup path and object pair e.g. ('key', object). The lookup path is anything you can pass to `_.get` (so nested paths with `.` or as an array are supported)
Found in: MobX observable objects, native JS objects
Example Usage: `F.flip(lookup, object)`

`(x => {})`
A function which returns the value when called with no arguments and sets it when called with one.
Found in: Knockout observables, jQuery plugin APIs
Example Usage: `F.flip(x => {})`

`(getter, setter)`
A getter and setter pair.
Found in: Anywhere you have a getter and setter function
Example Usage: `F.flip(getter, setter)`

> Note: Setter methods are generally mutable (unlike Ramda's lenses, for example).

We've included a few example "bindings" on `F.domLens`. These take a lens and return an object that's useful in a DOM context (like React or raw JS). In React terms, they're methods that generate the props you'd use to do two way binding to a lens.
![lens meme](http://giphygifs.s3.amazonaws.com/media/1jnyRP4DorCh2/giphy.gif)

### functionLens

Takes a value and returns a function lens for that value. Mostly used for testing and mocking purposes.

### objectLens

Takes a value and returns a object lens for that value. Mostly used for testing and mocking purposes.

### set

`propertyValue -> Lens -> object.propertyName`
Sets the value of the lens, regardless of its format

### fnToObj

Converts a function lens an object lens. Mostly used for testing and mocking purposes.

### objToFn

Converts an object lens to a function lens. Mostly used for testing and mocking purposes.

### lensProp

`propertyName -> object -> { get: () -> object.propertyName, set: propertyValue -> object.propertyName }`
Creates an object lens for a given property on an object. `.get` returns the value at that path and `set` places a new value at that path. Supports deep paths like lodash get/set.
You typically won't use this directly since it is supported implicitly.

### lensOf

Takes an object and returns an object with lenses at the values of each path. Basically `mapValues(lensProp)`. Typically you would use the implicit `(key, object)` format instead.

### includeLens

`value -> arrayLens -> includeLens`
An include lens represents membership of a value in a set. It takes a value and lens and returns a new lens - kind of like a "writeable computed" from MobX or Knockout. The view and set functions allow you to read and write a boolean value for whether or not a value is in an array. If you change to true or false, it will set the underlying array lens with a new array either without the value or with it pushed at the end.

### view

`Lens -> object.propertyName`
Gets the value of the lens, regardless of its format

### views

`Lens -> (() -> object.propertyName)`
Returns a function that gets the value of the lens, regardless of its format

### sets

Creates a function that will set a lens with the provided value

### setsWith

Takes an iteratee and lens and creates a function that will set a lens with the result of calling the iteratee with the provided value

### flip

Takes a lens and negates its value

### on

Returns a function that will set a lens to `true`

### off

Returns a function that will set a lens to `false`

### domLens.value

`lens -> {value, onChange}`
Takes a lens and returns a value/onChange pair that views/sets the lens appropriately. `onChange` sets with `e.target.value` (or `e` if that path isn't present).

Example:

```jsx
let Component = () => {
  let state = React.useState('')
  return <input {...F.domLens.value(state)}>
}
```

### domLens.checkboxValues

`(value, lens) -> {checked, onChange}`
Creates an includeLens and maps view to checked and set to `onChange` (set with `e.target.checked` or `e` if that path isn't present)

### domLens.hover

`lens -> { onMouseEnter, onMouseLeave }`
Takes a lens and returns on onMouseEnter which calls `on` on the lens and onMouseLeave which calls `off`. Models a mapping of "hovering" to a boolean.

### domLens.focus

`lens -> { onFocus, onBlur }`
Takes a lens and returns on onFocus which calls `on` on the lens and onBlur which calls `off`. Models a mapping of "focusing" to a boolean.

### domLens.targetBinding

`field -> lens -> {[field], onChange}`
Utility for building lens consumers like `value` and `checkboxValues`

### domLens.binding

`(field, getValue) -> lens -> {[field], onChange}`
Even more generic utility than targetBinding which uses `getEventValue` to as the function for a setsWith which is mapped to `onChange`.

### stateLens

`([value, setValue]) -> lens`
Given the popularity of React, we decided to include this little helper that converts a `useState` hook call to a lens. Ex: `let lens = stateLens(useState(false))`. You generally won't use this directly since you can pass the `[value, setter]` pair directly to lens functions

## Aspect

Aspects provide a functional oriented implementation of Aspect Oriented Programming.
An aspect wraps a function and allows you run code at various points like before and after execution.
Notably, aspects in this library allow you to have a shared state object between aspects and are very useful for automating things like status indicators, etc on functions.

There is a _lot_ of prior art in the javascript world, but most of it assumes a vaguely object oriented context.
The implementation in `futil-js` is done in just 20 lines of code and seems to capture all of the use cases of AOP.

**Note**: To do OO style AOP with this these aspects, just use lodash's `_.update` method and optionally `boundMethod` from `futil` if `this` matters

**Caveat**: While you can and should compose (or `_.flow`) aspects together, don't put non aspects in the middle of the composition. Aspects rely on a `.state` property on the wrapped function that they propagate through, but the chain will break if a non-aspect is mixed in between. Additionally, if you need external access to the state, make sure the aspects are the outer most part of the composition so the `.state` property will be available on the result of the composition.

There are a few basic aspects included on `F.aspects` (E.g. `var loggedFunc = F.aspect(F.aspects.logs)(func)`) because they seem to be universally useful.
All of the provided aspects take an `extend` function to allow customizing the state mutation method (e.g. in mobx, you'd use `extendObservable`).
If null, they default to `defaultsOn` from `futil-js` - check the unit tests for example usage.

### aspect

`{options} -> f -> aspectWrapped(f)`
The aspect api takes an options object and returns a function which takes a function to wrap.
The wrapped function will be decorated with a `state` object and is equivalent to the original function for all arguments.

Options supports the following parameters:

| Name                                    | Description                                                                                                                         |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `init: (state) -> ()`                   | A function for setting any inital state requirements. Should mutate the shared state object.                                        |
| `after: (result, state, params) -> ()`  | Runs after the wrapped function executes and recieves the shared state and the result of the function. Can be async.                |
| `before: (params, state) -> ()`         | Runs before the wrapped function executes and receves the shared state and the params passed to the wrapped function. Can be async. |
| `onError: (error, state, params) -> ()` | Runs if the wrapped function throws an error. If you don't throw inside this, it will swallow any errors that happen.               |
| `always: (state, params) -> ()`         | Runs after the wrapped function whether it throws an error or not, similar to a `Promise.catch`                                     |

Example:

```jsx
let exampleAspect = aspect({
  before: () => console.log('pre run'),
  after: () => console.log('post run'),
})
let f = () => console.log('run')
let wrapped = exampleAspect(f)
wrapped()
// Logs to the console:
// pre run
// run
// post run
```

### aspectSync

This is a synchronous version of `aspect`, for situations when it's not desirable to `await` a method you're adding aspects to. The API is the same, but things like `onError` won't work if you pass an async function to the aspect.

### aspects.logs

Logs adds a `logs` array to the function state and just pushes in results on each run

### aspects.error

Captures any exceptions thrown and set it on an `error` error it puts on state

### aspects.errors

Captures any exceptions thrown and pushes them sequentially into an `errors` array it puts on state

### aspects.status

Adds a `status` property that is set to `processing` before the wrapped function runs and `succeeded` when it's done or `failed` if it threw an exception. Also adds shortcuts on state for `processing`, `succeeded`, and `failed`, which are booleans which are based on the value of `status`. Also adds a `setStatus` method which is used internally to update these properties.

### aspects.deprecate

Utility for marking functions as deprecated - it's just a `before` with a console.warn. Takes the name of thing being deprecated, optionally deprecation version, and optionally an alternative and returns a higher order function which you can wrap deprecated methods in. This is what's used internally to mark deprecations. Includes a partial stack trace as part of the deprecation warning.

### aspects.clearStatus

Sets `status` to null after provided timeout (default is 500ms) elapses. If a null timeout is passed, it will never set status to null.

### aspects.concurrency

Prevents a function from running if it's state has `processing` set to true at the time of invocation

### aspects.command

Flows together `status`, `clearStatus`, `concurrency`, and `error`, taking `extend` and `timeout` as optional parameters to construct the aspect

## Tree

All tree functions take a traversal function so that you can customize how to traverse arbitrary nested structures.

_Note_: Be careful about cyclic structures that can result in infinite loops, such as objects with references to itself. There are cases where you'd intentionally want to visit the same node multiple times, such as traversing a directed acyclic graph (which would work just fine and eventually terminate, but would visit a node once for each parent it has connected to it) - but it's up to the user to be sure you don't create infinite loops.

### isTraversable

`node -> bool`
A default check if something can be traversed - currently it is arrays and plain objects.

### traverse

`node -> [...childNodes]`
The default traversal function used in other tree methods if you don't supply one. It returns false if it's not traversable or empty, and returns the object if it is.

### walk

`traverse -> (pre, post=_.noop) -> tree -> x`
A depth first search which visits every node returned by `traverse` recursively. Both `pre-order` and `post-order` traversals are supported (and can be mixed freely). `walk` also supports exiting iteration early by returning a truthy value from either the `pre` or `post` functions. The returned value is also the return value of `walk`. The pre, post, and traversal functions are passed the current node as well as the parent stack (where parents[0] is the direct parent).

### walkAsync

`traverse -> (pre, post=_.noop) -> async tree -> x`
A version of `walk` which supports async traversals.

### transformTree

`traverse -> _iteratee -> tree -> newTree`
Structure preserving pre-order depth first traversal which clones, mutates, and then returns a tree. Basically `walk` with a `_.cloneDeep` first (similar to a tree map because it preserves structure). `_iteratee` can be any suitable argument to `_.iteratee` https://lodash.com/docs/4.17.5#iteratee

### reduceTree

`traverse -> (accumulator, initialValue, tree) -> x`
Just like `_.reduce`, but traverses over the tree with the traversal function in `pre-order`.

### writeTreeNode

Default `writeNode` for `mapTree`. It writes the node to the parent at the given index.
Using the traversal function with tree iteratee properties to find children.

### mapTree

`(traverse, writeNode) -> f -> tree -> newTree`
Structure preserving tree map! `writeNode` informs how to write a single node, but the default will generally work for most cases. The iteratee is passed the standard `node, index, parents, parentIndexes` args and is expected to return a transformed node.

### mapTreeLeaves

`(traverse, writeNode) -> f -> tree -> newTree`
Like `mapTree`, but only operates on lead nodes. It is a convenience method for `mapTree(next, writeNode)(F.unless(next, mapper), tree)`

### treeToArrayBy

`traverse -> f -> tree -> [f(treeNode), f(treeNode), ...]`
Like `treeToArray`, but accepts a customizer to process the tree nodes before putting them in an array. The customizer is passed the standard `node, index, parents, parentIndexes` args and is expected to return a transformed node. It's `_.map` for trees - but it's not called treeMap because it does not preserve the structure as you might expect `map` to do. See `mapTree` for that behavior.

### treeToArray

`traverse -> tree -> [treeNode, treeNode, ...]`
Flattens the tree nodes into an array, simply recording the node values in pre-order traversal.

### leavesBy

`traverse -> f -> tree -> [f(treeNode), f(treeNode), ...]`
Like `leaves`, but accepts a customizer to process the leaves before putting them in an array.

### leaves

`traverse -> tree -> [treeNodes]`
Returns an array of the tree nodes that can't be traversed into in `pre-order`.

### treeLookup

`(traverse, buildIteratee) -> ([_iteratee], tree) -> treeNode`
Looks up a node matching a path, which defaults to lodash `iteratee` but can be customized with buildIteratee. The `_iteratee` members of the array can be any suitable arguments for `_.iteratee` https://lodash.com/docs/4.17.5#iteratee

### keyTreeByWith

`traverse -> transformer -> _iteratee -> tree -> result`
Similar to a keyBy (aka groupBy) for trees, but also transforms the grouped values (instead of filtering out tree nodes). The transformer takes three args, the current node, a boolean of if the node matches the current group, and what group is being evaluated for this iteratee. The transformer is called on each node for each grouping. `_iteratee` is any suitable argument to `_.iteratee`, as above.

### treeKeys

`(x, i, xs, is) => [i, ...is]`
A utility tree iteratee that returns the stack of node indexes

### treeValues

`(x, i, xs) => [x, ...xs]`
A utility tree iteratee that returns the stack of node values

### treePath

`(build, encoder) -> treePathBuilderFunction`
Creates a path builder for use in `flattenTree`. By default, the builder will look use child indexes and a dotEncoder. Encoder can be an encoding function or a futil `encoder` (an object with encode and decode functions)

### propTreePath

`prop -> treePathBuilderFunction`
Creates a path builder for use in `flattenTree`, using a slashEncoder and using the specified prop function as an iteratee on each node to determine the keys.

### flattenTree

`traverse -> buildPath -> tree -> result`
Creates a flat object with a property for each node, using `buildPath` to determine the keys. `buildPath` takes the same arguments as a tree walking iteratee. It will default to a dot tree path.

### findNode

`(traverse) -> (iteratee, tree) -> treeNode`
Finds the first node matching the iteratee in pre-order traversal. The
iteratee can be any suitable argument to `_.iteratee`
https://lodash.com/docs/4.17.5#iteratee

### resolveOnTree

`(traverse, writeNode) -> tree -> result`
Resolves all Promise nodes of a tree and replaces them with the result of calling `.then`
Exposed on `F.tree` as `resolveOn`
_CAUTION_ This method mutates the tree passed in. This is generally safe and more performant (and can be intuited from the `On` convention in the name), but it's worth calling out.

### tree

`(traverse, buildIteratee, writeNode) -> { walk, walkAsync, transform, reduce, toArrayBy, toArray, leaves, leavesBy, lookup, keyByWith, traverse, flatten, flatLeaves, map, mapLeaves, resolveOn }`
Takes a traversal function and returns an object with all of the tree methods pre-applied with the traversal. This is useful if you want to use a few of the tree methods with a custom traversal and can provides a slightly nicer api.
Exposes provided `traverse` function as `traverse`
