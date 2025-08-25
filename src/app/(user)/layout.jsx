import React from 'react';

// mui
import { Toolbar } from '@mui/material';

// components
import Navbar from 'src/layout/_main/navbar';
import Footer from 'src/layout/_main/footer';
import Topbar from 'src/layout/_main/topbar';
import ActionBar from 'src/layout/_main/actionbar';

// Meta information
export const metadata = {
  title: 'Fanboxes',
  description: 'Every box is a new adventure',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes',
  keywords: 'ecommerce, Fanboxes, Login Fanboxes, LoginFrom Fanboxes',
  icons: {
    icon: '/favicon.png'
  },
  openGraph: {
    images: 'https://fanboxes-user-frontend.vercel.app/favicon.png'
  }
};

export default async function RootLayout({ children }) {
  return (
    <>
      {children}
      <Toolbar sx={{ display: { xs: 'block', md: 'none' } }} />
    </>
  );
}
