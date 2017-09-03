import {connect} from 'react-redux'
import ScreeningSummary from 'investigations/ScreeningSummary'
import {Set, List} from 'immutable'
import SCREENING_DECISION_OPTIONS from 'enums/ScreeningDecisionOptions'

const mapStateToProps = (state, _ownProps) => {
  const allegations = state.getIn(['screeningSummary', 'allegations']) || List()
  const allegationTypes = allegations.reduce((uniq, alegation) => uniq.concat(alegation.get('allegation_types')), Set())
  const safetyAlerts = state.getIn(['screeningSummary', 'safety_alerts']) || List()
  const RESPONSE_TIMES = SCREENING_DECISION_OPTIONS.promote_to_referral.values
  return {
    id: state.getIn(['screeningSummary', 'id']),
    name: state.getIn(['screeningSummary', 'name']),
    safetyAlerts: safetyAlerts.toJS(),
    safetyInformation: state.getIn(['screeningSummary', 'safety_information']),
    decisionRationale: state.getIn(['screeningSummary', 'additional_information']),
    responseTime: RESPONSE_TIMES[state.getIn(['screeningSummary', 'decision_detail'])],
    allegations: allegationTypes.toJS(),
  }
}

const mapDispatchToProps = (_dispatch, _ownProps) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(ScreeningSummary)
