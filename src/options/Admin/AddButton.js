import React from 'react';
import './AddButton.css';

function AddButton({ caption, onClick, cssClass }) {
   return (
      <button className={'AddButton ' + cssClass} onClick={onClick}>
         {caption}
      </button>
   );
}

export default AddButton;
