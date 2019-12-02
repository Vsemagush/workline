import React from 'react';
import { ListItem, Text, Icon, Tooltip } from 'evergreen-ui'

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
            {subTask && hint && <Tooltip content={hint}>
               <Icon
                  icon="double-chevron-down" 
                  size={12} 
                  color="disabled" 
                  marginLeft={16}
                  className="User-Task__hint-cursor" />
            </Tooltip>}
      </ListItem>
   );
}

export default Task;
