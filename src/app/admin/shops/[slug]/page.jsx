'use client';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

// mui
import { useTheme } from '@mui/material';

// next
import { useRouter, usePathname } from 'next/navigation';

// components
import ShopDetailCover from 'src/components/_admin/shops/shopDetailCover';
import ShopDetail from 'src/components/_admin/shops/shopDetail';
import ShopIcomeList from '../../../../components/_admin/shops/shopIncome';
import AdminShopWiseProducts from 'src/components/_admin/products/shopWiseProductList';
import ShopProductList from 'src/components/_admin/shops/shopProduct';
import ShopOrderList from 'src/components/_admin/shops/shopOrder';

// icons
import { FaGifts, FaWallet } from 'react-icons/fa6';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { TbChartArrowsVertical } from 'react-icons/tb';

// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
import ShopSpinList from 'src/components/_admin/shops/shopSpin';

Page.propTypes = {
  params: PropTypes.object.isRequired
};

export default function Page({ params: { slug } }) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const [count, setCount] = useState(0);
  const { data, isLoading } = useQuery(['shop-by-admin', count], () => api.getShopDetailsByAdmin(slug));

  const [viewSection, setViewSection] = useState('income');

  function SetDataType(type) {
    // clear query params and keep only pathname
    router.replace(pathname);
    setViewSection(type);
  }

  const dataMain = [
    {
      name: 'Total Income',
      items: data?.totalEarnings,
      color: theme.palette.error.main,
      icon: <FaWallet size={30} />,
      viewFunction: () => SetDataType('income')
    },
    {
      name: 'Total Spins',
      items: `${data?.totalSpins || 0}`,
      color: theme.palette.success.main,
      icon: <TbChartArrowsVertical size={30} />,
      viewFunction: () => SetDataType('spin')
    },
    {
      name: 'Total Orders',
      items: data?.totalOrders,
      color: theme.palette.secondary.main,
      icon: <HiOutlineClipboardList size={30} />,
      viewFunction: () => SetDataType('order')
    },
    {
      name: 'Total Boxes',
      items: data?.totalProducts,
      color: theme.palette.primary.main,
      icon: <FaGifts size={30} />,
      viewFunction: () => SetDataType('box')
    }
  ];

  return (
    <div>
      <ShopDetailCover data={data?.data} isLoading={isLoading} />
      <ShopDetail data={dataMain} isLoading={isLoading} />

      {viewSection === 'income' && <ShopIcomeList slug={slug} />}
      {viewSection === 'box' && <ShopProductList slug={slug} />}
      {viewSection === 'order' && <ShopOrderList slug={slug} />}
      {viewSection === 'spin' && <ShopSpinList slug={slug} />}
    </div>
  );
}
