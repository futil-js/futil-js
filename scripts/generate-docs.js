import _ from 'lodash/fp'
import { writeFile, readFile } from 'fs/promises'
import docs from '../docs/data/jsdoc.json'
import { stringify, getTag } from './utils'

let outputDir = './docs/data/'

let githubSrcUrl = 'https://github.com/futil-js/futil-js/blob/master/src/'

let getNameFromDoc = _.flow(
  _.get('longname'),
  //  Cases:
  // "longname": "module:aspect~aspects.logs",
  // "longname": "module:lang.throws",
  _.replace(/module:\w*(~|\.)/, ''),
  // "longname": "convert(_In).hasIn",
  (x) => _.last(x.split(').'))
)

let seenTags = []
// Memoize so we only read each file once
let readSourceFile = _.memoize((path) => readFile(path, { encoding: 'utf8' }))
let getDocs = async () => {
  let jsDocToJson = _.flow(
    _.reject('undocumented'),
    _.reject({ kind: 'module' }),
    _.reject({ access: 'private' }),
    _.filter('name'),
    _.map(async (x) => {
      let path = `${x.meta.path}/${x.meta.filename}`
      let file = await readSourceFile(path)
      let source = file.slice(...x.meta.range).slice(7)
      let lineCount = _.size(_.split('\n', source))
      // TODO: change to @category or something similar
      let tags = [getTag('tags', x) || x.meta.filename.slice(0, -3)]
      // Track tags that are new for this method (to insert tag docs)
      let unseenTags = _.difference(tags, seenTags)
      seenTags = _.uniq(_.concat(seenTags, tags))
      return {
        name: getNameFromDoc(x),
        deprecated: x.deprecated,
        aliases: getTag('aliases', x),
        signature: getTag('signature', x),
        description: x.description,
        note: getTag('note', x),
        example: _.head(x.examples), // todo: support more?
        tags,
        unseenTags,
        source,
        lineCount,
        lineno: x.meta.lineno,
        // https://github.com/futil-js/futil-js/blob/master/src/array.js#L20-L25
        link: `${githubSrcUrl}${x.meta.filename}#L${x.meta.lineno}${
          lineCount === 1 ? '' : `-L${x.meta.lineno + lineCount - 1}`
        }`,
      }
    }),
    (x) => Promise.all(x)
  )

  let jsDocToTagDocs = _.flow(
    _.filter({ kind: 'module' }),
    // Cases:
    // "longname": "convert(_In)~inversions",
    // "longname": "module:lens"
    _.keyBy((x) => _.last(x.longname.split(':'))),
    _.mapValues('description')
  )

  let readmeOrder = [
    'function',
    'iterators',
    'logic',
    'collection',
    'convert',
    'convert(_In)',
    'convert(_On)',
    'convert(_Indexed)',
    'array',
    'object',
    'string',
    'regex',
    'math',
    'lang',
    'lens',
    'aspect',
    'tree',
  ]
  let sortTagsByReadmeOrder = _.sortBy(({ tags }) =>
    _.findIndex((x) => x === _.first(tags), readmeOrder)
  )

  let result = sortTagsByReadmeOrder(await jsDocToJson(docs))
  await writeFile(`${outputDir}docs.json`, stringify(result), { flag: 'w' })

  let tagDocs = jsDocToTagDocs(docs)
  await writeFile(`${outputDir}tag-docs.json`, stringify(tagDocs), {
    flag: 'w',
  })
}

getDocs()
