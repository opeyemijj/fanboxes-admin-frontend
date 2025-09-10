import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddSlide from 'src/components/_admin/slides/addSlide';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';
import AccessDenied from 'src/components/cards/AccessDenied';

// Meta information
export const metadata = {
  title: 'Add Categories - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default function page() {
  const canAdd = UsePermissionServer('add_new_slide');
  if (!canAdd) {
    return <AccessDenied message="You are not allowed to add Slide." redirect="/admin/dashboard" />;
  }

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Add Slide"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Slides',
            href: '/admin/slides'
          },
          {
            name: 'Add Slide'
          }
        ]}
      />
      <AddSlide />
    </div>
  );
}
