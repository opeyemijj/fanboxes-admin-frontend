import React from 'react';
// components
import AddItemForm from 'src/components/forms/boxItem';

export default function addBoxItem({ brands, categories, subCategories, isVendor, shops }) {
  return (
    <div>
      <AddItemForm
        brands={brands}
        categories={categories}
        subCategories={subCategories}
        shops={shops}
        isVendor={isVendor}
      />
    </div>
  );
}
