'use client';
import React from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import EditCategory from 'src/components/_admin/categories/editCategory';

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
  const { data, isLoading } = useQuery(['coupon-codes'], () => api.getCategoryByAdmin(params.slug), {
    onError: (err) => {
      toast.error(err.response.data.message || 'Something went wrong!');
    }
  });

  const canAdd = UsePermission('edit_category');
  if (!canAdd) {
    return <AccessDenied message="You are not allowed to edit Category." redirect="/admin/dashboard" />;
  }

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Edit Category"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Categories',
            href: '/admin/categories'
          },
          {
            name: data?.data?.name
          }
        ]}
      />
      <EditCategory isLoading={isLoading} data={data?.data} />
    </div>
  );
}
