/* eslint-env mocha */
import chai from 'chai'
import * as f from '../src'
chai.expect()
const expect = chai.expect

describe('Basic Functions', () => {
    it('maybeCall', () => {
        expect(f.maybeCall(() => 5)).to.deep.equal(5)
        expect(f.maybeCall(null)).to.deep.equal(false)
    })
    it('maybeCall should call fn with parameters', () => {
        const fn = (x, y) => x + y
        expect(f.maybeCall(fn, 5, 6)).to.deep.equal(fn(5, 6))
    })
})

describe('String Functions', () => {
    it('wrap', () => {
        expect(f.wrap('(', ')', 'asdf')).to.equal('(asdf)')
    })
    it('quote', () => {
        expect(f.quote('asdf')).to.equal('"asdf"')
    })
    it('parens', () => {
        expect(f.parens('asdf')).to.equal('(asdf)')
    })
})
