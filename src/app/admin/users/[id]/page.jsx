import React from 'react';
import { useLocation } from 'react-router-dom';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import UsersDetails from 'src/components/_admin/users/userDetails';

export default function page({ params }) {
  const notUser = parama
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="User Details"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Users',
            href: '/admin/users'
          },
          {
            name: 'Users details'
          }
        ]}
      />
      <UsersDetails id={params.id} />
    </>
  );
}
