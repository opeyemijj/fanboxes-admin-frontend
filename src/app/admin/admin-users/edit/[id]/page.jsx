'use client';
import React from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import EditAdminUser from 'src/components/_admin/admin-users/editAdmin';

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
  // const { data, isLoading } = useQuery(
  //     ['user-details', id, pageParam],
  //     () => api.getUserByAdmin(id + `?page=${pageParam || 1}`),
  //     {
  //       enabled: Boolean(id),
  //       retry: false
  //     }
  //   );

  const { data, isLoading } = useQuery(['coupon-codes'], () => api.getUserByAdmin(params.id + `?page=${1}`), {
    onError: (err) => {
      toast.error(err.response.data.message || 'Something went wrong!');
    }
  });

  // console.log(data, 'Getting data fo single user');

  const canEdit = UsePermission('edit_admin_user');
  if (!canEdit) {
    return <AccessDenied message="You are not allowed to edit Admin User." redirect="/admin/dashboard" />;
  }

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Edit User"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Admin Users',
            href: '/admin/admin-users'
          },
          {
            name: data?.user?.firstName
          }
        ]}
      />
      <EditAdminUser isLoading={isLoading} currentUser={data?.user} />
    </div>
  );
}
