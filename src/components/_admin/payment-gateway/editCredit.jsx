import React from 'react';
import PropTypes from 'prop-types';
// components
import CreditForm from 'src/components/forms/credit';

EditCredit.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default function EditCredit({ data, isLoading }) {
  return (
    <div>
      <CreditForm data={data} isLoading={isLoading} />
    </div>
  );
}
