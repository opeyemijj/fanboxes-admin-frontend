import React from 'react';

// components
import SubCategoryList from 'src/components/_admin/subCategories/categoryList';
import AccessDenied from 'src/components/cards/AccessDenied';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';

// apo
import * as api from 'src/services';

// Meta information
export const metadata = {
  title: 'Sub Categories - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default async function Categories() {
  const { data: categories } = await api.getAllCategoriesByAdmin();

  const canView = UsePermissionServer('view_subcategory_listing'); // check required permission

  if (!canView) {
    return <AccessDenied message="You are not allowed to manage Sub Category." redirect="/admin/dashboard" />;
  }

  const canAddSubcategory = UsePermissionServer('add_new_subcategory');

  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Sub Categories List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Sub Categories'
          }
        ]}
        action={
          canAddSubcategory
            ? {
                href: `/admin/sub-categories/add`,
                title: 'Add Sub Category'
              }
            : null
        }
      />
      <SubCategoryList categories={categories} />
    </>
  );
}
