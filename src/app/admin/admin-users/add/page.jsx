import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddAdmin from 'src/components/_admin/admin-users/addAdmin';

import * as api from 'src/services';

// Meta information
export const metadata = {
  title: 'Add Admin - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default async function page() {
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Add Admin"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Admin Users',
            href: '/admin/admin-users'
          },
          {
            name: 'Add Admin'
          }
        ]}
      />
      <AddAdmin />
    </div>
  );
}
