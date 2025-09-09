'use client';
import React from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// components
import EditAdminShopForm from 'src/components/forms/adminShop';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

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
  const { data, isLoading } = useQuery(['coupon-codes'], () => api.getShopDetailsByAdmin(params.slug), {
    onError: (err) => {
      toast.error(err.response.data.message || 'Something went wrong!');
    }
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery(['categories'], () => api.getAllCategories(), {
    onError: (err) => {
      toast.error(err.response.data.message || 'Something went wrong!');
    }
  });

  // const { data: categories } = await api.getAllCategories();

  console.log(categories, 'Checking the categoris');

  const canEdit = UsePermission('edit_influencer');
  if (!canEdit) {
    return <AccessDenied message="You are not allowed to edit Influencer." redirect="/admin/dashboard" />;
  }
  return (
    <>
      <HeaderBreadcrumbs
        heading="Dashboard"
        admin
        links={[
          {
            name: 'Admin',
            href: '/admin'
          },
          {
            name: 'Influencers',
            href: '/admin/shops'
          },
          {
            name: 'Edit'
          }
        ]}
      />
      <EditAdminShopForm data={data?.data} isLoading={isLoading || categoriesLoading} categories={categories?.data} />
    </>
  );
}
