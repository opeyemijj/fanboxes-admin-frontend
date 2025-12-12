import React from 'react';

// components
import AddCurrency from 'src/components/_admin/currencies/addCurrency';
import AccessDenied from 'src/components/cards/AccessDenied';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';

export default function page() {
  const canAdd = UsePermissionServer('add_new_currency');
  if (!canAdd) {
    return <AccessDenied message="You are not allowed to add Currency." redirect="/admin/dashboard" />;
  }

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Currency"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Currencies',
            href: '/admin/currencies'
          },
          {
            name: 'Add Currency'
          }
        ]}
      />
      <AddCurrency />
    </div>
  );
}
