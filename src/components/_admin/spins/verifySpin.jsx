'use client';
import React from 'react';
import { useSelector } from 'react-redux';
// components
import SpinVerifyForm from 'src/components/forms/spinVerify';

export default function VerifySpin() {
  const spinItem = useSelector(({ product }) => product?.spinData);
  console.log(spinItem, 'Okk SEE this state');
  return (
    <div>
      <SpinVerifyForm spinItem={spinItem?.spinItem} />
    </div>
  );
}
