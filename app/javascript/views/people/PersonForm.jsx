import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

const PersonForm = ({personId, roles, roleOptions}) => (
  <div className='card-body'>
    <div className='row'>
      <div className='col-md-12'>
        <label htmlFor={`roles_${personId}`}>Role</label>
        <Select
          multi
          tabSelectsValue={false}
          inputProps={{id: `roles_${personId}`}}
          value={roles}
          clearable={false}
          options={roleOptions}
          placeholder=''
        />
      </div>
    </div>
  </div>
)
PersonForm.propTypes = {
  personId: PropTypes.string.isRequired,
  roleOptions: PropTypes.array,
  roles: PropTypes.array,
}
export default PersonForm
