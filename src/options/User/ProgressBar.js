import React from 'react';
import { Pane, Text } from 'evergreen-ui';

function ProgressBar({progress}) {
   return (
      <Pane className="ProgressBar-Border"
         height={35}
         width="70%"
         position="relative"
         border="default"
         borderRadius={5}
         margin="10px"
         
         >
         <Pane
               className= "ProgressBar-Text"
               height="100%"
               background="#47B881"
               width={progress+"%"}
               position="absolute"
               borderTopRightRadius={10}
               borderBottomRightRadius={10}
               >
         </Pane>
         <Text  className= "ProgressBar-Number" position="absolute" left="50%" top="20%" >{Math.min(100, Math.ceil(progress))+"%"}</Text>
      </Pane>
               
   );
}

export default ProgressBar;
