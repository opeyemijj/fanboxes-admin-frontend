import React from 'react';
import PropTypes from 'prop-types';
// components
import RoleForm from 'src/components/forms/role';

EditRole.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default function EditRole({ routesGropuData, currentRole, isLoading }) {
  return (
    <div>
      <RoleForm routesGropuData={routesGropuData} currentRole={currentRole} isLoading={isLoading} />
    </div>
  );
}
