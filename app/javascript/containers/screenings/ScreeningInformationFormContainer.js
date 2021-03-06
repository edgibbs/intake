import {connect} from 'react-redux'
import ScreeningInformationForm from 'views/ScreeningInformationForm'
import COMMUNICATION_METHOD from 'enums/CommunicationMethod'
import {setField, resetFieldValues, touchField, touchAllFields} from 'actions/screeningInformationFormActions'
import {
  getScreeningInformationFormSelector,
  getScreeningWithEditsSelector,
  getVisibleErrorsSelector,
} from 'selectors/screeningInformationFormSelectors'
import {save as saveScreening} from 'actions/screeningActions'
import {setCardMode, SHOW_MODE} from 'actions/screeningPageActions'
import {getScreeningSelector} from 'selectors/screeningSelectors'

const mapStateToProps = (state) => {
  const screening = getScreeningSelector(state)
  const screeningInformationForm = getScreeningInformationFormSelector(state)
  const communicationMethods = Object.keys(COMMUNICATION_METHOD)
    .map((value) => ({value, label: COMMUNICATION_METHOD[value]}))
  return {
    screening: screening.toJS(),
    screeningWithEdits: getScreeningWithEditsSelector(state).toJS(),
    assignee: screeningInformationForm.getIn(['assignee', 'value']),
    assigneeDisabled: Boolean(screening.get('assignee_staff_id')),
    communicationMethod: screeningInformationForm.getIn(['communication_method', 'value']),
    communicationMethods,
    endedAt: screeningInformationForm.getIn(['ended_at', 'value']),
    errors: getVisibleErrorsSelector(state).toJS(),
    name: screeningInformationForm.getIn(['name', 'value']),
    startedAt: screeningInformationForm.getIn(['started_at', 'value']),
  }
}
const mergeProps = (stateProps, {dispatch}) => {
  const {
    screening,
    screeningWithEdits,
    assignee,
    assigneeDisabled,
    communicationMethod,
    communicationMethods,
    endedAt,
    errors,
    name,
    startedAt,
  } = stateProps
  const onCancel = () => {
    dispatch(resetFieldValues(screening))
    dispatch(touchAllFields())
    dispatch(setCardMode('screening-information-card', SHOW_MODE))
  }
  const onSave = () => {
    dispatch(saveScreening(screeningWithEdits))
    dispatch(touchAllFields())
    dispatch(setCardMode('screening-information-card', SHOW_MODE))
  }
  const onBlur = (fieldName) => dispatch(touchField(fieldName))
  const onChange = (fieldName, value) => dispatch(setField(fieldName, value))
  return {
    onBlur,
    onCancel,
    onChange,
    onSave,
    assignee,
    assigneeDisabled,
    communicationMethod,
    communicationMethods,
    endedAt,
    errors,
    name,
    startedAt,
  }
}
export default connect(mapStateToProps, null, mergeProps)(ScreeningInformationForm)
