'use client';
import React from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import EditItem from 'src/components/_admin/items/editItem';

// api
import * as api from 'src/services';
import { useQuery } from 'react-query';

import AccessDenied from 'src/components/cards/AccessDenied';
import { UsePermission } from 'src/hooks/usePermission';

Page.propTypes = {
  params: PropTypes.shape({
    slug: PropTypes.string.isRequired
  }).isRequired
};
export default function Page({ params }) {
  const { data, isLoading } = useQuery(['single-item'], () => api.getItemBySlug(params.slug), {
    onError: (err) => {
      toast.error(err.message || 'Something went wrong!');
    }
  });

  console.log(data, 'Checking the data');

  // const canAdd = UsePermission('edit_category');
  // if (!canAdd) {
  //   return <AccessDenied message="You are not allowed to edit Category." redirect="/admin/dashboard" />;
  // }

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
            name: 'Items',
            href: '/admin/items'
          },
          {
            name: data?.data?.name
          }
        ]}
      />
      <EditItem isLoading={isLoading} data={data?.data} />
    </div>
  );
}
