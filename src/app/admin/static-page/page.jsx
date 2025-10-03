import React from 'react';

// Components
import PaymentGateWayList from 'src/components/_admin/payment-gateway/paymentGateWayList';
import AccessDenied from 'src/components/cards/AccessDenied';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';

// Meta information
export const metadata = {
  title: 'Static Page Gateway',
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
        heading="Stack Page"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Static Page'
          }
        ]}
        action={{
          href: `/admin/static-page/add`,
          title: 'Add'
        }}
      />

      <PaymentGateWayList />
    </>
  );
}
