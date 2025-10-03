import React from 'react';
import PropTypes from 'prop-types';
// components
import PaymentGateWayForm from 'src/components/forms/paymentGateWay';

EditPaymentGateWay.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default function EditPaymentGateWay({ data, isLoading }) {
  return (
    <div>
      <PaymentGateWayForm data={data} isLoading={isLoading} />
    </div>
  );
}
