import React from 'react';

// components
import ShopList from 'src/components/_admin/shops/shopList';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// Meta information
export const metadata = {
  title: 'Influencers - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default async function AdminProducts() {
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Influencers"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Influencers'
          }
        ]}
        action={{
          href: `/admin/shops/add`,
          title: 'Add Influencer'
        }}
      />
      <ShopList />
    </>
  );
}
