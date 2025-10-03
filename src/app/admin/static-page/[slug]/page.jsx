'use client';
import React from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import EditStaticPage from 'src/components/_admin/static-page/editStatic';

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
  const { data, isLoading } = useQuery(['static-page'], () => api.getStaticPageByAdmin(params.slug), {
    onError: (err) => {
      console.log(err, 'Check the error');
      toast.error(err.message || 'Something went wrong!');
    }
  });

  const canAdd = UsePermission('edit_conversion');
  if (!canAdd) {
    return <AccessDenied message="You are not allowed to edit conversion." redirect="/admin/dashboard" />;
  }

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Static Page',
            href: '/admin/static-page'
          },
          {
            name: data?.data?.title
          }
        ]}
      />
      <EditStaticPage isLoading={isLoading} data={data?.data} />
    </div>
  );
}
