import React from 'react';
// components
import AddItemForm from 'src/components/forms/boxItem';

export default function addBoxItem({ boxDetails, isVendor }) {
  return (
    <div>
      <AddItemForm boxDetails={boxDetails} isVendor={isVendor} />
    </div>
  );
}
