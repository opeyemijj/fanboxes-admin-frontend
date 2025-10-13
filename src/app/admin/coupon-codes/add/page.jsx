import React from 'react';

import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddCouponCode from 'src/components/_admin/couponCodes/addCouponCode';
import * as api from 'src/services';
import { SortArrayAlphabetically } from 'src/utils/sorting';

export default async function page() {
  const { data: shops } = await api.getAllShopsByAdmin();

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
