import React from 'react'
import PropTypes from 'prop-types'
import AlertInfoMessage from 'common/AlertInfoMessage'
import CountySelectField from 'common/CountySelectField'

class CrossReportForm extends React.Component {
  render() {
    const {
      actions: {
        fetchCountyAgencies,
        resetFieldValues,
        saveScreening,
        setField,
      },
      counties,
      county_id,
      screening,
      screeningWithEdits,
      toggleShow,
    } = this.props
    const cancel = () => {
      resetFieldValues(screening)
      toggleShow()
    }
    const save = () => {
      saveScreening(screeningWithEdits)
      toggleShow()
    }
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
            onChange={({target: {value}}) => {
              fetchCountyAgencies(value)
              setField('county_id', value)
            }}
            counties={counties}
            value={county_id}
          />
        </div>
        <div className='row'>
          <div className='centered'>
            <button className='btn btn-primary' onClick={save}>Save</button>
            <button className='btn btn-default' onClick={cancel}>Cancel</button>
          </div>
        </div>
      </div>
    )
  }
}

CrossReportForm.propTypes = {
  actions: PropTypes.object.isRequired,
  alertInfoMessage: PropTypes.string,
  counties: PropTypes.array.isRequired,
  county_id: PropTypes.string,
  errors: PropTypes.object,
  screening: PropTypes.object,
  screeningWithEdits: PropTypes.object,
  toggleShow: PropTypes.func.isRequired,
}

export default CrossReportForm
