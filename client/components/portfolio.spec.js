/* global describe beforeEach it */

import {expect} from 'chai'
import React from 'react'
import enzyme, {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {Portfolio} from './portfolio'

const adapter = new Adapter()
enzyme.configure({adapter})

describe('Portfolio', () => {
  let portfolio

  beforeEach(() => {
    portfolio = shallow(<Portfolio email="cody@email.com" />)
  })

  it('renders the email in an h3', () => {
    expect(portfolio.find('h3').text()).to.be.equal('Welcome, cody@email.com')
  })
})
