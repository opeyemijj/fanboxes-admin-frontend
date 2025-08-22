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
  title: 'Fanboxes E-commerce Script | Your Gateway to Seamless Shopping and Secure Transactions',
  description:
    'Log in to Fanboxes for secure access to your account. Enjoy seamless shopping, personalized experiences, and hassle-free transactions. Your trusted portal to a world of convenience awaits. Login now!',
  applicationName: 'Fanboxes',
  authors: 'Fanboxes',
  keywords: 'ecommerce, Fanboxes, Commerce, Login Fanboxes, LoginFrom Fanboxes',
  icons: {
    icon: '/favicon.png'
  },
  openGraph: {
    images: 'https://nextall.vercel.app/opengraph-image.png?1c6a1fa20db2840f'
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
