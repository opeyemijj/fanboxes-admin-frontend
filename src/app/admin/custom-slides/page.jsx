import React from 'react';

// Components
import CustomSlideList from 'src/components/_admin/custom-slides/customSlideList';
import AccessDenied from 'src/components/cards/AccessDenied';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';

// Meta information
export const metadata = {
  title: 'Slides - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default function CustomSlide() {
  // const canView = UsePermissionServer('view_category_listing'); // check required permission

  // if (!canView) {
  //   return <AccessDenied message="You are not allowed to manage Category." redirect="/admin/dashboard" />;
  // }

  // const canAddCategory = UsePermissionServer('add_new_category');

  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Slide List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Slides'
          }
        ]}
        action={{
          href: `/admin/categories/add`,
          title: 'Add Slide'
        }}
      />

      <CustomSlideList />
    </>
  );
}
