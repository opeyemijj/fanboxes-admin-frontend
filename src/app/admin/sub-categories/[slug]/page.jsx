'use client';
import React from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import EditSubCategory from 'src/components/_admin/subCategories/editCategory';

// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
import { UsePermission } from 'src/hooks/usePermission';
import AccessDenied from 'src/components/cards/AccessDenied';

Page.propTypes = {
  params: PropTypes.shape({
    slug: PropTypes.string.isRequired
  }).isRequired
};
export default function Page({ params }) {
  const { data, isLoading } = useQuery(['sub-category-admin'], () => api.getSubCategoryByAdmin(params.slug), {
    onError: (err) => {
      toast.error(err.response.data.message || 'Something went wrong!');
    }
  });

  const canEdit = UsePermission('edit_subcategory');
  if (!canEdit) {
    return <AccessDenied message="You are not allowed to edit SubCategory." redirect="/admin/dashboard" />;
  }

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Edit Sub Categories"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Sub Categories',
            href: '/admin/sub-categories'
          },
          {
            name: data?.data?.name
          }
        ]}
      />
      <EditSubCategory data={data?.data} categories={data?.categories} isLoading={isLoading} />
    </div>
  );
}
