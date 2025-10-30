import React from 'react';
import PropTypes from 'prop-types';
// components
import ItemForm from 'src/components/forms/item';

EditItem.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default function EditItem({ data, isLoading, brands, shops }) {
  return (
    <div>
      <ItemForm currentItem={data} isLoading={isLoading} brands={brands} shops={shops} />
    </div>
  );
}
