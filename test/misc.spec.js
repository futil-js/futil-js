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
  it('toggler', () => {
    const toggle1Or2 = f.toggler(1)(2)
    expect(toggle1Or2(1)).to.equal(2)
    expect(toggle1Or2(2)).to.equal(1)
    expect(toggle1Or2(0)).to.equal(1)

    const toggleBool = f.toggler(true)(false)
    expect(toggleBool(true)).to.equal(false)
    expect(toggleBool(false)).to.equal(true)
    expect(toggleBool()).to.equal(true)
  })
})

describe('String Functions', () => {
  it('wrap', () => {
    expect(f.wrap('(', ')', 'asdf')).to.equal('(asdf)')
    expect(f.wrap(null, null, 'asdf')).to.equal('asdf')
  })
  it('quote', () => {
    expect(f.quote('asdf')).to.equal('"asdf"')
  })
  it('parens', () => {
    expect(f.parens('asdf')).to.equal('(asdf)')
  })
})

describe('Math Functions', () => {
  it('greaterThanOne', () => {
    for (let i = -10; i < 10; i++) {
      expect(f.greaterThanOne(i)).to.equal(i > 1)
    }
  })
})
