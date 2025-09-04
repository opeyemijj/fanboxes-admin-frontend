import React from 'react';

import * as api from 'src/services';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddRole from 'src/components/_admin/roles/addRole';

// Meta information
export const metadata = {
  title: 'Add Categories - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};
export default async function page() {
  const { data: routesGropuData } = await api.getAllPermissionRouteGroup();
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Create Role"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Roles',
            href: '/admin/roles'
          },
          {
            name: 'Add Role'
          }
        ]}
      />
      <AddRole routesGropuData={routesGropuData} />
    </div>
  );
}
