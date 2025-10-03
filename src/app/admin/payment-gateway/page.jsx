import React from 'react';

// Components
import CreditList from 'src/components/_admin/credits/creditList';
import AccessDenied from 'src/components/cards/AccessDenied';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';

// Meta information
export const metadata = {
  title: 'Payment Gateway',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default function Payments() {
  // const canView = UsePermissionServer('view_conversion_listing'); // check required permission

  // if (!canView) {
  //   return <AccessDenied message="You are not allowed to manage Credits & Conversion." redirect="/admin/dashboard" />;
  // }

  // const canAddConversion = UsePermissionServer('add_new_conversion');

  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Payment Gateway"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Payments'
          }
        ]}
        action={{
          href: `/admin/payment-gateway/add`,
          title: 'Add'
        }}
      />

      <CreditList />
    </>
  );
}
