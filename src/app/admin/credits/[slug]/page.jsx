'use client';
import React from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import EditCredit from 'src/components/_admin/credits/editCredit';

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
  const { data, isLoading } = useQuery(['credit'], () => api.getCreditByAdmin(params.slug), {
    onError: (err) => {
      console.log(err, 'Check the error');
      toast.error(err.message || 'Something went wrong!');
    }
  });

  console.log(data, 'Check the edit data');

  // const canAdd = UsePermission('edit_category');
  // if (!canAdd) {
  //   return <AccessDenied message="You are not allowed to edit Category." redirect="/admin/dashboard" />;
  // }

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Edit Credit"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Credits',
            href: '/admin/credits'
          },
          {
            name: data?.data?.name
          }
        ]}
      />
      <EditCredit isLoading={isLoading} data={data?.data} />
    </div>
  );
}
