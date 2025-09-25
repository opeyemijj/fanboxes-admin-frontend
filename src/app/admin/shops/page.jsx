import React from 'react';

// components
import ShopList from 'src/components/_admin/shops/shopList';
import AccessDenied from 'src/components/cards/AccessDenied';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';
import { SortArrayAlphabetically } from 'src/utils/sorting';
import * as api from 'src/services';

// Meta information
export const metadata = {
  title: 'Influencers - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default async function AdminProducts() {
  const canView = UsePermissionServer('view_influencer_listing'); // check required permission

  if (!canView) {
    return <AccessDenied message="You are not allowed to manage Influencers." redirect="/admin/dashboard" />;
  }

  const canAddInfluencer = UsePermissionServer('add_new_influencer');

  const { data: categories } = await api.getAllCategoriesByAdmin();

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
        action={
          canAddInfluencer
            ? {
                href: `/admin/shops/add`,
                title: 'Add Influencer'
              }
            : null
        }
      />
      <ShopList categories={SortArrayAlphabetically(categories, 'name')} />
    </>
  );
}
