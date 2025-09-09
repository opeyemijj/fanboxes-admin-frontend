'use client';
import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import EditItem from 'src/components/_admin/products/editItem';

// api
import * as api from 'src/services';
import { useSelector } from 'react-redux';
import { UsePermission } from 'src/hooks/usePermission';
import AccessDenied from 'src/components/cards/AccessDenied';

export default function Page({ params }) {
  const selectedBoxAndItemData = useSelector(({ product }) => product?.boxAndItemData);
  // console.log(selectedBoxAndItemData, 'Okk SEE this state');

  const canEdit = UsePermission('edit_box_item');
  if (!canEdit) {
    return <AccessDenied message="You are not allowed to edit Item." redirect="/admin/dashboard" />;
  }

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Edit Item"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Boxes',
            href: '/admin/products'
          },
          {
            name: 'Edit Item'
          }
        ]}
      />
      <EditItem selectedBoxAndItemData={selectedBoxAndItemData} slug={params.slug} />
    </div>
  );
}
