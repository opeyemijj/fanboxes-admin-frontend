import React from 'react';
import PropTypes from 'prop-types';
// components
import SlideForm from 'src/components/forms/slide';

EditCategory.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default function EditCategory({ data, isLoading }) {
  return (
    <div>
      <SlideForm data={data} isLoading={isLoading} />
    </div>
  );
}
