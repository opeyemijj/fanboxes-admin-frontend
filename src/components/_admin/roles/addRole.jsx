import React from 'react';
// components
import RoleForm from 'src/components/forms/role';

export default function AddCategory({ routesGropuData }) {
  return (
    <div>
      <RoleForm routesGropuData={routesGropuData} />
    </div>
  );
}
