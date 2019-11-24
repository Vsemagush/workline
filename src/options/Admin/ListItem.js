import React from 'react';

function ListItem({ text, onClick, cssClass }) {
   return (
      <div onClick={onClick} className={cssClass}>
         {text}
      </div>
   );
}

export default ListItem;
