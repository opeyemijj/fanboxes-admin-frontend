import React from 'react';
import PropTypes from 'prop-types';
// components
import AdminUserForm from 'src/components/forms/admin-user';

EditAdminUser.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default function EditAdminUser({ currentUser, isLoading }) {
  return (
    <div>
      <AdminUserForm currentUser={currentUser} isLoading={isLoading} />
    </div>
  );
}
