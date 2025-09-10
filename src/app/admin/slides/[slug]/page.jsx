'use client';
import React from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import EditSlide from 'src/components/_admin/slides/editSlide';

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
  const { data, isLoading } = useQuery(['slide'], () => api.getSlideByAdmin(params.slug), {
    onError: (err) => {
      toast.error(err.message || 'Something went wrong!');
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
        heading="Edit Side"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Slides',
            href: '/admin/slides'
          },
          {
            name: data?.data?.title
          }
        ]}
      />
      <EditSlide isLoading={isLoading} data={data?.data} />
    </div>
  );
}
