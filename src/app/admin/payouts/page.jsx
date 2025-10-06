import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import PayoutsList from 'src/components/_admin/payouts';

// api
import * as api from 'src/services';
import { SortArrayAlphabetically } from 'src/utils/sorting';

// Meta information
export const metadata = {
  title: 'Payouts - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};
export default async function page() {
  const { data: shops } = await api.getAllShopsByAdmin();
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Payouts"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Payouts'
          }
        ]}
      />
      <PayoutsList shops={SortArrayAlphabetically(shops)} />
    </div>
  );
}
