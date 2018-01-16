import _ from 'lodash/fp'
import { push } from './array'
import { findIndexed } from './conversion'

export let isTraversable = x => _.isArray(x) || _.isPlainObject(x)
export let traverse = x => isTraversable(x) && !_.isEmpty(x) && x

export let walk = (next = traverse) => (
  pre,
  post = _.noop,
  parents = [],
  parentIndexes = []
) => (tree, index) =>
  pre(tree, index, parents, parentIndexes) ||
  findIndexed(
    walk(next)(pre, post, [tree, ...parents], [index, ...parentIndexes]),
    next(tree, index, parents, parentIndexes) || []
  ) ||
  post(tree, index, parents, parentIndexes)

export let transformTree = (next = traverse) =>
  _.curry((f, x) => {
    let result = _.cloneDeep(x)
    walk(next)(f)(result)
    return result
  })

export let reduceTree = (next = traverse) =>
  _.curry((f, result, tree) => {
    walk(next)((...x) => {
      result = f(result, ...x)
    })(tree)
    return result
  })

export let treeToArrayBy = (next = traverse) =>
  _.curry((fn, tree) => reduceTree(next)((r, x) => push(fn(x), r), [], tree))
export let treeToArray = (next = traverse) => treeToArrayBy(next)(x => x)

export let leaves = (next = traverse) =>
  _.flow(treeToArray(next), _.reject(next))

export let treeLookup = (next = traverse, buildIteratee = _.identity) => (
  path,
  tree
) =>
  _.reduce((tree, path) => _.find(buildIteratee(path), next(tree)), tree, path)

export let keyTreeByWith = (next = traverse) =>
  _.curry((transformer, groupIteratee, x) =>
    _.flow(
      treeToArrayBy(next)(_.iteratee(groupIteratee)),
      _.uniq,
      _.keyBy(_.identity),
      _.mapValues(group =>
        transformTree(next)(node => {
          let matches = _.iteratee(groupIteratee)(node) === group
          transformer(node, matches, group)
        }, x)
      )
    )(x)
  )

export let tree = (next = traverse, buildIteratee = _.identity) => ({
  walk: walk(next),
  transform: transformTree(next),
  reduce: reduceTree(next),
  toArrayBy: treeToArrayBy(next),
  toArray: treeToArray(next),
  leaves: leaves(next),
  lookup: treeLookup(next, buildIteratee),
  keyByWith: keyTreeByWith(next),
})
