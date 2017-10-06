import CheckboxField from 'common/CheckboxField'
import DateField from 'common/DateField'
import Immutable from 'immutable'
import AlertInfoMessage from 'common/AlertInfoMessage'
import PropTypes from 'prop-types'
import React from 'react'
import SelectField from 'common/SelectField'
import CountySelectField from 'common/CountySelectField'
import {AGENCY_TYPES, COMMUNICATION_METHODS} from 'enums/CrossReport'

export default class CrossReportEditView extends React.Component {
  constructor(props) {
    super(props)
    const [firstCrossReport] = props.crossReports.toJS()
    this.state = {
      county: firstCrossReport && firstCrossReport.county,
      communicationMethod: firstCrossReport && firstCrossReport.communication_method,
      reportedOn: firstCrossReport && firstCrossReport.reported_on,
    }
  }

  persistedInfo(agencyType) {
    return this.props.crossReports.toJS().find((item) => item.agency_type === agencyType)
  }

  crossReportData() {
    return AGENCY_TYPES.map((agencyType) => {
      const persistedInfo = this.persistedInfo(agencyType)
      return {
        agencyType: agencyType,
        selected: Boolean(persistedInfo),
        agencyName: persistedInfo && persistedInfo.agency_code,
      }
    })
  }

  updatedCrossReports(agencyType, fieldName, value) {
    const {crossReports} = this.props
    if (fieldName === 'agency_code') {
      const index = crossReports.toJS().findIndex((item) => item.agency_type === agencyType)
      return crossReports.setIn([index, 'agency_code'], value || null)
    }
    if (fieldName === 'agency_type') {
      const existingReport = crossReports.find((report) => report.get('agency_type') === agencyType)
      if (value) {
        if (existingReport) {
          return crossReports
        }
        return crossReports.push(
          Immutable.Map({
            county: this.state.county,
            agency_type: agencyType,
            agency_code: null,
            reported_on: this.state.reportedOn,
            communication_method: this.state.communicationMethod,
          }))
      }
      return crossReports.filterNot((item) => item.get('agency_type') === agencyType)
    }
    if (fieldName === 'county') {
      this.setState({reportedOn: null})
      this.setState({communicationMethod: null})
      return Immutable.List()
    }
    if (value === '') {
      value = null
    }
    return crossReports.map((crossReport) => crossReport.set(fieldName, value))
  }

  renderCrossReport(crossReportOptions) {
    const {errors} = this.props
    return (
      <div className='col-md-6'>
        <ul className='unstyled-list'>
          {
            crossReportOptions.map((item) => {
              const {agencyType, selected, agencyName} = item
              const typeId = agencyType.replace(/ /gi, '_').toUpperCase()
              return (
                <li key={agencyType}>
                  <div className='half-gap-bottom'>
                    <CheckboxField
                      id={`type-${typeId}`}
                      checked={selected}
                      errors={errors.getIn([agencyType, 'agency_type']) && errors.getIn([agencyType, 'agency_type']).toJS()}
                      disabled={this.props.countyAgencies[typeId] === undefined || this.props.countyAgencies[typeId].length === 0}
                      onBlur={(event) =>
                        this.props.onBlur(
                          this.updatedCrossReports(agencyType, 'agency_type', event.target.checked),
                          ['agency_type', agencyType]
                        )
                      }
                      onChange={(event) =>
                        this.props.onChange(
                          this.updatedCrossReports(agencyType, 'agency_type', event.target.checked),
                          ['agency_type', agencyType]
                        )
                      }
                      required={this.props.isAgencyRequired(agencyType)}
                      value={agencyType}
                    />
                    {
                      selected &&
                          <SelectField
                            errors={errors.getIn([agencyType, 'agency_code']) && errors.getIn([agencyType, 'agency_code']).toJS()}
                            id={`${typeId}-agency-code`}
                            label={`${agencyType} agency name`}
                            onBlur={(event) =>
                              this.props.onBlur(
                                this.updatedCrossReports(agencyType, 'agency_code', event.target.value),
                                ['agency_code', agencyType]
                              )
                            }
                            onChange={(event) =>
                              this.props.onChange(
                                this.updatedCrossReports(agencyType, 'agency_code', event.target.value),
                                ['agency_code', agencyType]
                              )
                            }
                            required
                            value={agencyName || ''}
                          >
                            <option key='' />
                            {this.props.countyAgencies[typeId] !== undefined && this.props.countyAgencies[typeId].map((agency) => <option key={agency.id} value={agency.id}>{agency.name}</option>)}
                          </SelectField>
                    }
                  </div>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }

  render() {
    const startIndex = 0
    const halfIndex = 2
    const hasCrossReport = !this.props.crossReports.isEmpty()
    const crossReportData = this.crossReportData()

    // reported_on is a single value, but stored on >1 cross reports.
    // In theory, all values will either be the same or undefined so flatMap
    // is just an alternative to picking an arbitrary item to retrieve from.
    const reportedOnErrors = this.props.errors.toSet().flatMap((item) => item.get('reported_on')).toJS()
    const communicationErrors = this.props.errors.toSet().flatMap((item) => item.get('communication_method')).toJS()

    return (
      <div className='card-body no-pad-top'>
        { this.props.alertInfoMessage && <AlertInfoMessage message={this.props.alertInfoMessage} /> }
        <div className='row col-md-12'>
          <label>This report has cross reported to:</label>
        </div>
        <div className='row'>
          <CountySelectField
            gridClassName='col-md-6'
            id='cross_report_county'
            onChange={(event) => {
              this.props.actions.fetchCountyAgencies(event.target.value)
              this.props.onChange(
                this.updatedCrossReports(null, 'county', event.target.value),
                ['county']
              )
              this.setState({county: event.target.value})
            }}
            value={this.state.county}
            counties={this.props.counties}
          />
        </div>
        <div className='row gap-top'>
          { this.state.county && this.renderCrossReport(crossReportData.slice(startIndex, halfIndex)) }
          { this.state.county && this.renderCrossReport(crossReportData.slice(halfIndex)) }
        </div>
        <div className='row gap-top'>
          {
            hasCrossReport &&
              <fieldset className='fieldset-inputs'>
                <legend>Communication Time and Method</legend>
                <DateField
                  errors={reportedOnErrors}
                  gridClassName='col-md-6'
                  id='cross_report_reported_on'
                  label='Cross Reported on Date'
                  onBlur={(value) => {
                    this.props.onBlur(
                      this.updatedCrossReports(null, 'reported_on', value), ['reported_on']
                    )
                  }}
                  onChange={(value) => {
                    this.props.onChange(
                      this.updatedCrossReports(null, 'reported_on', value), ['reported_on']
                    )
                    this.setState({reportedOn: value})
                  }}
                  hasTime={false}
                  required
                  value={this.state.reportedOn}
                />
                <SelectField
                  errors={communicationErrors}
                  gridClassName='col-md-6'
                  id='cross_report_communication_method'
                  label='Communication Method'
                  onBlur={(event) => {
                    this.props.onBlur(
                      this.updatedCrossReports(null, 'communication_method', event.target.value),
                      ['communication_method']
                    )
                  }}
                  onChange={(event) => {
                    this.props.onChange(
                      this.updatedCrossReports(null, 'communication_method', event.target.value),
                      ['communication_method']
                    )
                    this.setState({communicationMethod: event.target.value})
                  }}
                  required
                  value={this.state.communicationMethod}
                >
                  <option key='' />
                  {COMMUNICATION_METHODS.map((item) => <option key={item} value={item}>{item}</option>)}
                </SelectField>
              </fieldset>
          }
        </div>
        <div className='row'>
          <div className='centered'>
            <button className='btn btn-primary' onClick={this.props.onSave}>Save</button>
            <button className='btn btn-default' onClick={this.props.onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    )
  }
}

CrossReportEditView.propTypes = {
  actions: PropTypes.object.isRequired,
  alertInfoMessage: PropTypes.string,
  counties: PropTypes.array.isRequired,
  countyAgencies: PropTypes.object.isRequired,
  crossReports: PropTypes.object,
  errors: PropTypes.object.isRequired,
  isAgencyRequired: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}
