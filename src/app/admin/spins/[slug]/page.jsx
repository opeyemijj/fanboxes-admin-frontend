import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import VerifySpin from 'src/components/_admin/spins/verifySpin';

// Meta information
export const metadata = {
  title: 'Add Categories - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};

export default function page() {
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Spin Verification"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'Spins',
            href: '/admin/spins'
          },
          {
            name: 'Verify'
          }
        ]}
      />
      <VerifySpin />
    </div>
  );
}
