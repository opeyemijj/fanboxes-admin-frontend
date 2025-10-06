import React from 'react';

// Components
import PaymentGateWayList from 'src/components/_admin/payment-gateway/paymentGateWayList';
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
  const canView = UsePermissionServer('view_payment_gateway_listing'); // check required permission

  if (!canView) {
    return <AccessDenied message="You are not allowed to manage Payment Gateway." redirect="/admin/dashboard" />;
  }

  const canAddConversion = UsePermissionServer('add_new_payment_gateway');

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
            name: 'Payment Gateway'
          }
        ]}
        action={
          canAddConversion
            ? {
                href: `/admin/payment-gateway/add`,
                title: 'Add'
              }
            : null
        }
      />

      <PaymentGateWayList />
    </>
  );
}
