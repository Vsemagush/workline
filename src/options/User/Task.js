import React from 'react';

const STATUS_DONE = 'done';
const STATUS_CLOSED = 'closed';

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

function Task() {
   return (
      <div></div>
   );
}

export default Task;
