import React, { useState } from 'react';
import {Icon, Text, ListItem, Dialog} from 'evergreen-ui';

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

function Task({state,description,additional,subTask}) {

   const [isHint,setIsShowHint] = useState(false); 

   return (
      <ListItem
         className="Task-AlignCenter"
         marginRight={20}
         marginLeft={subTask && 50 || 20}
         width="100%">
            
         <Icon 
            icon={iconStyle[state].icon}
            color={iconStyle[state].color}
            flexShrink={0}
            size={subTask && 25 || 30}
         />
         <Text
            fontSize={subTask && 20 || 30}
            padding={20}
            paddingLeft={40}
            className={"Task-Color-Status-"+state}>
            {description}
         </Text>
         
         {subTask && state!="closed" && <Icon
            icon="info-sign" 
            color={state==="processing" && "blue" || "rgb(71, 184, 129)"}
            size={25}
            onClick= {()=>{setIsShowHint(true)}}/>
         }
         { isHint && <Dialog
            isShown={isHint}
            title="Подсказка к заданию"
            onCloseComplete={() => setIsShowHint(false)}
            hasFooter={false}>
            <Text fontSize="20px">{additional}</Text>
                     </Dialog>
         }
   
   </ListItem>
   );
   
}

export default Task;
