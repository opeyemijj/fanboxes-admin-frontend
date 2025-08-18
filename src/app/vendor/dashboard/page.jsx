import React from 'react';

// components
import Dashboard from 'src/components/_admin/dashboard';

// Meta information
export const metadata = {
  title: 'Fanboxes - Dashboard',
  description: 'Welcome to the Fanboxes Dashboard. Manage your e-commerce operations with ease.',
  applicationName: 'Fanboxes Dashboard',
  authors: 'Fanboxes',
  keywords: 'dashboard, e-commerce, management, Fanboxes',
  icons: {
    icon: '/favicon.png'
  }
};

export default function page() {
  return (
    <>
      <Dashboard isVendor />
    </>
  );
}
