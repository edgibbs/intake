import {
  AGENCY_TYPES,
  DISTRICT_ATTORNEY,
  DEPARTMENT_OF_JUSTICE,
  LAW_ENFORCEMENT,
  COUNTY_LICENSING,
  COMMUNITY_CARE_LICENSING,
} from 'enums/CrossReport'
import {
  getDistrictAttorneyAgenciesSelector,
  getDepartmentOfJusticeAgenciesSelector,
  getLawEnforcementAgenciesSelector,
  getCountyLicensingAgenciesSelector,
  getCommunityCareLicensingAgenciesSelector,
} from 'selectors/countyAgenciesSelectors'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import CrossReportForm from 'views/CrossReportForm'
import {fetch as fetchCountyAgencies} from 'actions/countyAgenciesActions'
import {
  clearAllAgencyFields,
  clearAllFields,
  resetFieldValues,
  save as saveCrossReport,
  setAgencyField,
  setAgencyTypeField,
  setField,
  touchAgencyField,
  touchAllFields,
  touchField,
} from 'actions/crossReportFormActions'
import {save as saveScreening} from 'actions/screeningActions'
import {setCardMode} from 'actions/screeningPageActions'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import {
  getAllegationsRequireCrossReportsValueSelector,
  getVisibleErrorsSelector,
  getScreeningWithEditsSelector,
  getDistrictAttorneyFormSelector,
  getDepartmentOfJusticeFormSelector,
  getLawEnforcementFormSelector,
  getCountyLicensingFormSelector,
  getCommunityCareLicensingFormSelector,
} from 'selectors/crossReportFormSelectors'

const mapStateToProps = (state) => ({
  allegationsRequireCrossReports: getAllegationsRequireCrossReportsValueSelector(state),
  areCrossReportsRequired: getAllegationsRequireCrossReportsValueSelector(state),
  communityCareLicensing: getCommunityCareLicensingFormSelector(state).toJS(),
  counties: state.get('counties').toJS(),
  county_id: state.getIn(['crossReportForm', 'county_id', 'value']) || '',
  countyAgencies: {
    [DEPARTMENT_OF_JUSTICE]: getDepartmentOfJusticeAgenciesSelector(state).toJS(),
    [DISTRICT_ATTORNEY]: getDistrictAttorneyAgenciesSelector(state).toJS(),
    [LAW_ENFORCEMENT]: getLawEnforcementAgenciesSelector(state).toJS(),
    [COMMUNITY_CARE_LICENSING]: getCommunityCareLicensingAgenciesSelector(state).toJS(),
    [COUNTY_LICENSING]: getCountyLicensingAgenciesSelector(state).toJS(),
  },
  countyLicensing: getCountyLicensingFormSelector(state).toJS(),
  departmentOfJustice: getDepartmentOfJusticeFormSelector(state).toJS(),
  districtAttorney: getDistrictAttorneyFormSelector(state).toJS(),
  hasAgencies: Boolean(Object.keys(AGENCY_TYPES).reduce((result, key) => result || state.getIn(['crossReportForm', key, 'selected']), false)),
  errors: getVisibleErrorsSelector(state).toJS(),
  inform_date: state.getIn(['crossReportForm', 'inform_date', 'value']) || '',
  lawEnforcement: getLawEnforcementFormSelector(state).toJS(),
  method: state.getIn(['crossReportForm', 'method', 'value']) || '',
  screening: getScreeningSelector(state).toJS(),
  screeningWithEdits: getScreeningWithEditsSelector(state).toJS(),
})
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    clearAllAgencyFields,
    clearAllFields,
    resetFieldValues,
    saveCrossReport,
    setAgencyField,
    setAgencyTypeField,
    setField,
    touchAgencyField,
    touchAllFields,
    touchField,
    saveScreening,
    fetchCountyAgencies,
    setCardMode,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(CrossReportForm)
