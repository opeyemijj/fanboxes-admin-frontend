'use client';
import React from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// components
import BoxItemForm from 'src/components/forms/boxItem';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';

export default function EditItem({ selectedBoxAndItemData, brands, categories, slug, shops, isVendor }) {
  return (
    <div>
      <BoxItemForm
        shops={null}
        brands={null}
        categories={null}
        currentProduct={selectedBoxAndItemData.item}
        isLoading={false}
        // isVendor={isVendor}
        selectedBoxAndItemData
        boxDetails={selectedBoxAndItemData}
      />
    </div>
  );
}
