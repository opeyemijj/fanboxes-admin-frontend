import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import PayoutsList from 'src/components/_admin/payouts';

// api
import * as api from 'src/services';
import { SortArrayAlphabetically } from 'src/utils/sorting';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';
import AccessDenied from 'src/components/cards/AccessDenied';

// Meta information
export const metadata = {
  title: 'Payouts - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};
export default async function page() {
  const { data: shops } = await api.getAllShopsByAdmin();

  const canView = UsePermissionServer('view_payout_listing'); // check required permission

  if (!canView) {
    return <AccessDenied message="You are not allowed to manage Payouts." redirect="/admin/dashboard" />;
  }

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Payouts"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Payouts'
          }
        ]}
      />
      <PayoutsList shops={SortArrayAlphabetically(shops)} />
    </div>
  );
}
