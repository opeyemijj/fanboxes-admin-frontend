'use client';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

// mui
import { useTheme } from '@mui/material';

// components
import ShopDetailCover from 'src/components/_admin/shops/shopDetailCover';
import ShopDetail from 'src/components/_admin/shops/shopDetail';
import ShopIcomeList from '../../../../components/_admin/shops/shopIncome';

// icons
import { FaGifts } from 'react-icons/fa6';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { TbChartArrowsVertical } from 'react-icons/tb';
import { FaWallet } from 'react-icons/fa6';

// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
import AdminShopWiseProducts from 'src/components/_admin/products/shopWiseProductList';
import ShopProductList from 'src/components/_admin/shops/shopProduct';

Page.propTypes = {
  params: PropTypes.object.isRequired
};

export default function Page({ params: { slug } }) {
  const theme = useTheme();
  const [count, setCount] = React.useState(0);
  const { data, isLoading } = useQuery(['shop-by-admin', count], () => api.getShopDetailsByAdmin(slug));

  const [viewSection, setViewSection] = useState('box');

  function SetDataType(type) {
    console.log('Check the type');
    setViewSection(type);
  }

  const dataMain = [
    {
      name: 'Total Income',
      items: data?.totalEarnings,
      color: theme.palette.error.main,
      icon: <FaWallet size={30} />
    },
    {
      name: 'Total Commission',
      items: data?.totalCommission,
      color: theme.palette.success.main,
      icon: <TbChartArrowsVertical size={30} />
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
      {/* {JSON.stringify(data)} */}
      <ShopDetailCover data={data?.data} isLoading={isLoading} />
      <ShopDetail data={dataMain} isLoading={isLoading} />
      {/* <ShopIcomeList slug={slug} onUpdatePayment={() => setCount((prev) => prev + 1)} count={count} /> */}

      {viewSection === 'box' && <ShopProductList slug={slug} />}
    </div>
  );
}
