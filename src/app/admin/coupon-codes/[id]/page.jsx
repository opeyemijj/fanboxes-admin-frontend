'use client';
import React from 'react';

import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import EditCouponCode from 'src/components/_admin/couponCodes/editCouponCode';
import * as api from 'src/services';
// usequery
import { useQuery } from 'react-query';
import PropTypes from 'prop-types';
import { SortArrayAlphabetically } from 'src/utils/sorting';
import { UsePermission } from 'src/hooks/usePermission';
import AccessDenied from 'src/components/cards/AccessDenied';

Page.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
};
export default function Page({ params }) {
  const { data, isLoading } = useQuery(['coupon-codes'], () => api.getCouponCodeByAdmin(params.id), {
    onError: (err) => {
      toast.error(err.response.data.message || 'Something went wrong!');
    }
  });

  const { data: shopData, isLoading: shopLoading } = useQuery(['admin-shops'], () => api.getShopsByAdmin(), {
    onError: (err) => {
      toast.error(err.response.data.message || 'Something went wrong!');
    }
  });

  const canEdit = UsePermission('edit_coupon_code');
  if (!canEdit) {
    return <AccessDenied message="You are not allowed to edit Coupon Code." redirect="/admin/dashboard" />;
  }

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Edit Cupon"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Cupon Codes',
            href: '/admin/coupon-codes'
          },
          {
            name: data?.data?.name
          }
        ]}
      />
      <EditCouponCode
        data={data?.data}
        isLoading={isLoading || shopLoading}
        shops={SortArrayAlphabetically(shopData?.data, 'title')}
      />
    </div>
  );
}
