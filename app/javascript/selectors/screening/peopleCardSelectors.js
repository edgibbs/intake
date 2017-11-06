import {Map} from 'immutable'
import {createSelector} from 'reselect'
import {getScreeningSelector} from 'selectors/screeningSelectors'
import {participantFlag} from 'utils/accessIndicator'
import nameFormatter from 'utils/nameFormatter'

export const getPersonNamesSelector = createSelector(
  (state) => state.get('participants'),
  (people) => people.reduce((namesMap, person) => (
    namesMap.set(person.get('id'), nameFormatter(person.toJS()))
  ), Map()),
)

export const getPersonInformationFlagValuesSelector = createSelector(
  (state) => state.get('participants'),
  (people) => people.reduce((informationFlagMap, person) => (
    informationFlagMap.set(person.get('id'), participantFlag(person.toJS()))
  ), Map()),
)
