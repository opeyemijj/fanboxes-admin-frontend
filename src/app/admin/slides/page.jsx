import React from 'react';

// Components
import SlideList from 'src/components/_admin/slides/slideList';
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
  const canView = UsePermissionServer('view_slide_listing'); // check required permission

  if (!canView) {
    return <AccessDenied message="You are not allowed to manage Slide." redirect="/admin/dashboard" />;
  }

  const canAddSlide = UsePermissionServer('add_new_slide');

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
        action={
          canAddSlide
            ? {
                href: `/admin/slides/add`,
                title: 'Add Slide'
              }
            : null
        }
      />
      <SlideList />
    </>
  );
}
