import React from 'react';

// Components
import CategoryList from 'src/components/_admin/categories/categoryList';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// Meta information
export const metadata = {
  title: 'Categories - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default function Categories() {
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Categories List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Categories'
          }
        ]}
        action={{
          href: `/admin/categories/add`,
          title: 'Add Category'
        }}
      />

      <CategoryList />
    </>
  );
}
