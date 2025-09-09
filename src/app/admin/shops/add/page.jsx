import React from 'react';
import AccessDenied from 'src/components/cards/AccessDenied';
import * as api from 'src/services';
// components
import AdminShopForm from 'src/components/forms/adminShop';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';

export default async function Page() {
  const canAdd = UsePermissionServer('add_new_influencer');
  if (!canAdd) {
    return <AccessDenied message="You are not allowed to add Influencer." redirect="/admin/dashboard" />;
  }

  const { data: categories } = await api.getAllCategories();

  return (
    <>
      <HeaderBreadcrumbs
        heading="Dashboard"
        admin
        links={[
          {
            name: 'Admin',
            href: '/admin'
          },
          {
            name: 'Influencers',
            href: '/admin/shops'
          },
          {
            name: 'Add'
          }
        ]}
      />
      <AdminShopForm categories={categories} />
    </>
  );
}
