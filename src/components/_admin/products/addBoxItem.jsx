import React from 'react';
// components
import AddItemForm from 'src/components/forms/boxItem';

export default function addBoxItem({ boxDetails, brands, categories, subCategories, isVendor, shops }) {
  console.log(boxDetails, 'Box details in item add form? 1');
  return (
    <div>
      <AddItemForm
        brands={brands}
        categories={categories}
        subCategories={subCategories}
        shops={shops}
        isVendor={isVendor}
        boxDetails={boxDetails}
      />
    </div>
  );
}
