import React from 'react';

import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddCouponCode from 'src/components/_admin/couponCodes/addCouponCode';
import * as api from 'src/services';
import { SortArrayAlphabetically } from 'src/utils/sorting';
import { UsePermissionServer } from 'src/hooks/usePermissionServer';
import AccessDenied from 'src/components/cards/AccessDenied';

export default async function page() {
  const { data: shops } = await api.getAllShopsByAdmin();

  const canAdd = UsePermissionServer('add_new_coupon_code');
  if (!canAdd) {
    return <AccessDenied message="You are not allowed to add coupon code." redirect="/admin/dashboard" />;
  }

  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Coupon Code List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Coupon code',
            href: '/admin/coupon-codes'
          },
          {
            name: 'Add coupon code'
          }
        ]}
      />
      <AddCouponCode shops={SortArrayAlphabetically(shops, 'title')} />
    </div>
  );
}
