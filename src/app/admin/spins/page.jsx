import React from 'react';

// components
import SpinList from 'src/components/_admin/shops/spinList';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// Meta information
export const metadata = {
  title: 'Products - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default async function AdminProducts() {
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Spins"
        links={[
          {
            name: 'Dashboard',
            href: '/admin'
          },
          {
            name: 'Spins'
          }
        ]}
        // action={{
        //   href: `/admin/shops/add`,
        //   title: 'Add Influencer'
        // }}
      />
      <SpinList />
    </>
  );
}
