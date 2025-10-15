'use client';
import React from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// components
import EditBrand from 'src/components/_admin/brands/editBrand';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// api
import { useQuery } from 'react-query';
import * as api from 'src/services';
import { UsePermission } from 'src/hooks/usePermission';
import AccessDenied from 'src/components/cards/AccessDenied';

Page.propTypes = {
  params: PropTypes.shape({
    slug: PropTypes.string.isRequired
  }).isRequired
};

export default function Page({ params }) {
  const { data, isLoading } = useQuery(['coupon-codes'], () => api.getBrandByAdmin(params.slug), {
    onError: (err) => {
      toast.error(err.response.data.message || 'Something went wrong!');
    }
  });

  const canAdd = UsePermission('edit_brand');
  if (!canAdd) {
    return <AccessDenied message="You are not allowed to edit brand." redirect="/admin/dashboard" />;
  }

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Categories List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Brands',
            href: '/admin/brands'
          },
          {
            name: data?.data.name
          }
        ]}
      />
      <EditBrand data={data?.data} isLoading={isLoading} />
    </div>
  );
}
