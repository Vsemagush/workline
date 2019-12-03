import React, { useState } from 'react';
import { ListItem, Text, Icon, Dialog } from 'evergreen-ui'

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

function Task({ text, status, subTask, hint }) {
   // Флаг показа подсказки
   const [showHint, setShowHint] = useState();

   return (
      <ListItem
         icon={iconStyle[status].icon}
         iconColor={iconStyle[status].color}
         className="User-Task__iconTaskGroup"
         margin={18}>
            <Text 
               size={subTask && 500 || 600} 
               className={'User-Task__pdg User-Task__' + status}>
                  {text}
            </Text>
            {subTask && status !== STATUS_CLOSED && hint && <Icon
               icon="info-sign" 
               color={status === STATUS_DONE ? 'success' : 'info'} 
               marginLeft={16}
               className="User-Task__hint-cursor"
               onClick={() => {
                  setShowHint(true);
               }}
            />}
            {hint && <Dialog
               isShown={showHint}
               hasFooter={false}
               title="Подсказка к заданию"
               onCancel={() => {
                  setShowHint();
               }}
               preventBodyScrolling
               >
               {hint}
            </Dialog>}
      </ListItem>
   );
}

export default Task;
