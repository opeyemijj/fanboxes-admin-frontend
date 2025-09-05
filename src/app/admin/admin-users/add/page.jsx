import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddAdmin from 'src/components/_admin/admin-users/addAdmin';

// Meta information
export const metadata = {
  title: 'Add Categories - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default function page() {
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
