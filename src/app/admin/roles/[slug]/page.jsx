'use client';
import React from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import EditRole from 'src/components/_admin/roles/editRole';

// api
import * as api from 'src/services';
import { useQuery } from 'react-query';

Page.propTypes = {
  params: PropTypes.shape({
    slug: PropTypes.string.isRequired
  }).isRequired
};
export default function Page({ params }) {
  const { data: routesGropuData, isLoading: routesDataLoading } = useQuery(
    ['routes-data'],
    () => api.getAllPermissionRouteGroup(params.slug),
    {
      onError: (err) => {
        toast.error(err.response.data.message || 'Something went wrong!');
      }
    }
  );

  const { data, isLoading } = useQuery(['roles'], () => api.getRoleByAdmin(params.slug), {
    onError: (err) => {
      toast.error(err.response.data.message || 'Something went wrong!');
    }
  });

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Role Edit"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Roles',
            href: '/admin/roles'
          },
          {
            name: data?.data?.role
          }
        ]}
      />
      <EditRole
        routesGropuData={routesGropuData?.data}
        isLoading={isLoading || routesDataLoading}
        currentRole={data?.data}
      />
    </div>
  );
}
