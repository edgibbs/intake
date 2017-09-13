import React from 'react'
import Immutable from 'immutable'
import NarrativeShowView from 'screenings/NarrativeShowView'
import {shallow} from 'enzyme'

describe('NarrativeShowView', () => {
  let screening
  let component
  let onEdit

  describe('with VALID data', () => {
    beforeEach(() => {
      screening = Immutable.fromJS({
        report_narrative: 'some narrative',
      })
      onEdit = jasmine.createSpy()
      component = shallow(<NarrativeShowView screening={screening} errors={{}} onEdit={onEdit} />)
    })

    it('renders the report narrative label as required', () => {
      expect(component.find('ShowField[label="Report Narrative"]').props().required)
        .toEqual(true)
    })

    it('renders the narrative show field', () => {
      expect(component.find('ShowField').length).toEqual(1)
      expect(component.find('ShowField[label="Report Narrative"]').html())
        .toContain('some narrative')
    })
  })

  describe('with INVALID data', () => {
    const errors = {report_narrative: ['That is not a report narrative, this is a report narrative']}
    beforeEach(() => {
      screening = Immutable.fromJS({
        report_narrative: 'some narrative',
      })
      onEdit = jasmine.createSpy()
      component = shallow(<NarrativeShowView screening={screening} errors={errors} onEdit={onEdit} />)
    })

    it('renders the narrative show field', () => {
      expect(component.find('ShowField').html()).toContain(errors.report_narrative[0])
    })
  })
})
