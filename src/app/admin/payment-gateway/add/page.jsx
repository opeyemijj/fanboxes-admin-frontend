import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddPaymentGateWay from 'src/components/_admin/payment-gateway/addPaymetGateWay';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';
import AccessDenied from 'src/components/cards/AccessDenied';

// Meta information
export const metadata = {
  title: 'Add Payment - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default function page() {
  // const canAdd = UsePermissionServer('add_new_conversion');
  // if (!canAdd) {
  //   return <AccessDenied message="You are not allowed to add conversion." redirect="/admin/dashboard" />;
  // }

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Add"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Payments',
            href: '/admin/payment-gateway'
          },
          {
            name: 'Add Payment'
          }
        ]}
      />
      <AddPaymentGateWay />
    </div>
  );
}
