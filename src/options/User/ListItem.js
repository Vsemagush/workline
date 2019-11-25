import React from 'react';

function ListItem({ text, cssClass }) {
   return (
      <li className={'User__item-' + cssClass}>
         <div>{text}</div>
      </li>
   );
}

export default ListItem;
