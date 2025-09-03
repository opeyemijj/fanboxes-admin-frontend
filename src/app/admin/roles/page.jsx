import React from 'react';

// Components
import RoleList from 'src/components/_admin/roles/roleList';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// Meta information
export const metadata = {
  title: 'Roles - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default function Roles() {
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Roles List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Roles'
          }
        ]}
        action={{
          href: `/admin/roles/add`,
          title: 'Add Role'
        }}
      />

      <RoleList />
    </>
  );
}
