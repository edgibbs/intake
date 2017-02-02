import PersonSuggestion from 'components/common/PersonSuggestion'
import React from 'react'
import {shallow} from 'enzyme'

describe('PersonSuggestion', () => {
  it('renders first and last name', () => {
    const props = {firstName: 'Bart', lastName: 'Simpson'}
    const component = shallow(<PersonSuggestion {...props} />)
    expect(component.html()).toContain('<strong>Bart Simpson</strong>')
  })

  describe('ssn', () => {
    it('renders when present', () => {
      const props = {ssn: '123-456-7890'}
      const component = shallow(<PersonSuggestion {...props} />)
      expect(component.html()).toContain(
        '<div><strong class="c-gray half-pad-right">SSN</strong><span>123-456-7890</span></div>'
      )
    })

    it('does not render when not present', () => {
      const props = {ssn: null}
      const component = shallow(<PersonSuggestion {...props} />)
      expect(component.html()).not.toContain('SSN')
    })
  })

  describe('address', () => {
    it('does not render when not present', () => {
      const props = {address: null}
      const component = shallow(<PersonSuggestion {...props} />)
      expect(component.find('AddressInfo').length).toEqual(0)
    })
  })

  describe('render components', () => {
    let component
    beforeEach(() => {
      component = shallow(<PersonSuggestion />)
    })

    it('renders the GenderRaceAndEthnicity', () => {
      expect(component.find('GenderRaceAndEthnicity').length).toEqual(1)
    })

    it('renders the AgeInfo', () => {
      expect(component.find('AgeInfo').length).toEqual(1)
    })

    it('renders the AddressInfo', () => {
      const props = {address: {}}
      const component = shallow(<PersonSuggestion {...props} />)
      expect(component.find('AddressInfo').length).toEqual(1)
    })
  })
})
