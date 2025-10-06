import React from 'react';

// Components
import StaticPageList from 'src/components/_admin/static-page/staticPageList';
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
  const canView = UsePermissionServer('view_static_page_listing'); // check required permission

  if (!canView) {
    return <AccessDenied message="You are not allowed to manage Static pages." redirect="/admin/dashboard" />;
  }

  const canAddStaticPages = UsePermissionServer('add_new_static_page');

  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Static Page"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Static Page'
          }
        ]}
        action={
          canAddStaticPages
            ? {
                href: `/admin/static-page/add`,
                title: 'Add'
              }
            : null
        }
      />

      <StaticPageList />
    </>
  );
}
