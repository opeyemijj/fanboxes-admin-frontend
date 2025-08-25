import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import NewsletterList from 'src/components/_admin/newsletter/newsletterList';

// Meta information
export const metadata = {
  title: 'Newsletter - Fanboxes',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes'
};
export default function page() {
  return (
    <div>
      {' '}
      <HeaderBreadcrumbs
        admin
        heading="Newsletter List"
        links={[
          {
            name: 'Dashboard',
            href: '/admin/dashboard'
          },
          {
            name: 'newsletter'
          }
        ]}
      />
      <NewsletterList />
    </div>
  );
}
