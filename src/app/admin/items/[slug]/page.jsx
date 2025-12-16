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
import { SortArrayAlphabetically } from 'src/utils/sorting';

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

  const {
    data: brandsData,
    isLoading: brandsLoading,
    error
  } = useQuery(['brands'], () => api.getAllBrandsByAdmin(), {
    onError: (err) => toast.error(err.message || 'Something went wrong!')
  });

  const {
    data: shops,
    isLoading: shopApiLoading,
    error: shoperror
  } = useQuery(['shops'], () => api.getAllShopsByAdmin(), {
    onError: (err) => toast.error(err.message || 'Something went wrong!')
  });

  const canAdd = UsePermission('edit_item');
  if (!canAdd) {
    return <AccessDenied message="You are not allowed to edit item." redirect="/admin/dashboard" />;
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
            name: 'Items',
            href: '/admin/items'
          },
          {
            name: data?.data?.name
          }
        ]}
      />
      <EditItem
        isLoading={isLoading || brandsLoading}
        data={data?.data}
        brands={SortArrayAlphabetically(brandsData?.data, 'name')}
        shops={SortArrayAlphabetically(shops?.data, 'title')}
      />
    </div>
  );
}
