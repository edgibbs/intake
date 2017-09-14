export const SET_CONTACT = 'SET_CONTACT'
export const TOUCH_CONTACT_FIELD = 'TOUCH_CONTACT_FIELD'

export function setContact({investigation_id, started_at, status}) {
  return {type: SET_CONTACT, investigation_id, started_at, status}
}
export function touchContactField(field) {
  return {type: TOUCH_CONTACT_FIELD, field}
}
