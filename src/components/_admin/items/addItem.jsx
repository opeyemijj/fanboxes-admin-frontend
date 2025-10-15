import React from 'react';
// components
import ItemForm from 'src/components/forms/item';

export default function AddCategory({ brands }) {
  return (
    <div>
      <ItemForm brands={brands} />
    </div>
  );
}
