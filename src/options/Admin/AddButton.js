import React from 'react';
import { IconButton } from 'evergreen-ui';

function AddButton({ onClick }) {
   return <IconButton icon="plus" onClick={onClick} />;
}

export default AddButton;
