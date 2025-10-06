'use client';
import React from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import EditPaymentGateWay from 'src/components/_admin/payment-gateway/editPaymentGateWay';

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
  const { data, isLoading } = useQuery(['payment-gateway'], () => api.getPaymentGateWayByAdmin(params.slug), {
    onError: (err) => {
      console.log(err, 'Check the error');
      toast.error(err.message || 'Something went wrong!');
    }
  });

  const canEdit = UsePermission('edit_payment_gateway');
  if (!canEdit) {
    return <AccessDenied message="You are not allowed to edit payment." redirect="/admin/dashboard" />;
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
            name: 'Payment Gateway',
            href: '/admin/payment-gateway'
          },
          {
            name: data?.data?.name
          }
        ]}
      />
      <EditPaymentGateWay isLoading={isLoading} data={data?.data} />
    </div>
  );
}
