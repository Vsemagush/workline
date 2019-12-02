import React from 'react';
import { IconButton } from 'evergreen-ui';

function AddButton({ onClick, tooltip }) {
   return (
      <IconButton
         icon="plus"
         onClick={onClick}
         appearance="minimal"
         title={tooltip}
      />
   );
}

export default AddButton;
