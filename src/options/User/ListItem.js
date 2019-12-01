import React from 'react';
import { Icon } from 'evergreen-ui'

/** Стиль иконки в зависимости от статуса задачи */
const iconStyle = {
   'done': {
      color: 'success',
      icon: 'tick-circle'
   },
   'processing': {
      color: 'warning',
      icon: 'refresh'
   },
   'closed': {
      color: 'disabled',
      icon: 'disable'
   }
}

function ListItem({ text, status, marginLeft }) {
   return (
      <div>
         <Icon
            icon={iconStyle[status].icon}
            color={iconStyle[status].color}
            marginLeft={marginLeft}
            marginRight={16}
         />
         <span className={'User__item-' + status}>{text}</span>
      </div>
   );
}

export default ListItem;
