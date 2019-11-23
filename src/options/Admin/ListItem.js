import React from 'react';
import PropTypes from 'prop-types';

function ListItem({ text, onClick }) {
   return (
      <div onClick={onClick} className="List__listItem">
         {text}
      </div>
   );
}

ListItem.propTypes = {
   text: PropTypes.string.isRequired,
   onClick: PropTypes.func,
};

export default ListItem;
