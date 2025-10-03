import React from 'react';
import PropTypes from 'prop-types';
// components
import StaticForm from 'src/components/forms/staticPage';

EditStaticPage.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default function EditStaticPage({ data, isLoading }) {
  return (
    <div>
      <StaticForm data={data} isLoading={isLoading} />
    </div>
  );
}
