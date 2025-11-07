import React from 'react';

// Components
import CurrencyList from 'src/components/_admin/currencies/currencyList';
import AccessDenied from 'src/components/cards/AccessDenied';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';

// Meta information
export const metadata = {
  title: 'Currencies - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};
export default function Currencies() {
  const canView = UsePermissionServer('view_category_listing'); // check required permission

  if (!canView) {
    return <AccessDenied message="You are not allowed to manage Currency." redirect="/admin/dashboard" />;
  }

  const canAddCurrency = UsePermissionServer('add_new_currency');

  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Currencies List"
        links={[
          {
            name: 'Admin Dashboard',
            href: '/admin'
          },
          {
            name: 'Currencies'
          }
        ]}
        action={
          canAddCurrency
            ? {
                href: `/admin/currencies/add`,
                title: 'Add currency'
              }
            : null
        }
      />
      <CurrencyList />
    </>
  );
}
