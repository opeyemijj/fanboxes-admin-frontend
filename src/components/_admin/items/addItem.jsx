import React from 'react';
// components
import ItemForm from 'src/components/forms/item';

export default function AddCategory({ brands, shops }) {
  return (
    <div>
      <ItemForm brands={brands} shops={shops} />
    </div>
  );
}
