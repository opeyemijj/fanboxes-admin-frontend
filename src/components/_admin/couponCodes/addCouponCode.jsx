import React from 'react';
// components
import CouponCodeForm from 'src/components/forms/couponCode';

export default function addCouponCode({ shops }) {
  return (
    <div>
      <CouponCodeForm shops={shops} />
    </div>
  );
}
