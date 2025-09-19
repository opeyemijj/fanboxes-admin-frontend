import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import OrdersList from 'src/components/_admin/orders/ordersList';

// api
import * as api from 'src/services';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';
import AccessDenied from 'src/components/cards/AccessDenied';
// Meta information
export const metadata = {
  title: 'Order - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};
export default async function page() {
  const { data: shops } = await api.getAllShopsByAdmin();
  const canView = UsePermissionServer('view_order_listing'); // check required permission

  if (!canView) {
    return <AccessDenied message="You are not allowed to manage Orders." redirect="/admin/dashboard" />;
  }
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Orders List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Orders'
          }
        ]}
      />
      <OrdersList shops={shops} />
    </div>
  );
}
