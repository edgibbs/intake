import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'
import {FETCH_SCREENING_COMPLETE} from 'actions/actionTypes'

const buildPerson = ({legacy_descriptor, roles, first_name}) => fromJS({
  legacy_descriptor: {value: legacy_descriptor},
  roles: {value: roles},
  first_name: {value: first_name},
})
export default createReducer(Map(), {
  [FETCH_SCREENING_COMPLETE]: (state, {payload: {screening}, error}) => {
    if (error) {
      return state
    } else {
      return screening.participants.reduce((people, participant) => (
        people.set(participant.id, buildPerson(participant))
      ), Map())
    }
  },
})
