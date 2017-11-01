import {FETCH_CONTACT_SUCCESS} from 'actions/contactActions'
import {createReducer} from 'utils/createReducer'
import {Map, fromJS} from 'immutable'

export default createReducer(Map(), {
  [FETCH_CONTACT_SUCCESS](_state, {payload}) {
    const {
      communication_method,
      id,
      investigation_id,
      location,
      note,
      people,
      purpose,
      started_at,
      status,
    } = payload
    return fromJS({
      communication_method,
      id,
      investigation_id,
      location,
      note,
      people,
      purpose,
      started_at,
      status,
    })
  },
})
