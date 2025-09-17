import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddCredit from 'src/components/_admin/credits/addCredit';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';
import AccessDenied from 'src/components/cards/AccessDenied';

// Meta information
export const metadata = {
  title: 'Add Credit - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default function page() {
  const canAdd = UsePermissionServer('add_new_conversion');
  if (!canAdd) {
    return <AccessDenied message="You are not allowed to add conversion." redirect="/admin/dashboard" />;
  }

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
            name: 'Credits',
            href: '/admin/credits'
          },
          {
            name: 'Add Conversion'
          }
        ]}
      />
      <AddCredit />
    </div>
  );
}
