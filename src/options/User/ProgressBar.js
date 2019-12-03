import React from 'react';
import { Pane, Text } from 'evergreen-ui';

function ProgressBar({ progress }) {
   return (
      <Pane border="default" width="100%" height={24} borderRadius={5} position="relative">
         <Pane
            width={progress + '%'}
            height="100%"
            background="greenTint"
            borderTopRightRadius={10}
            borderBottomRightRadius={10}
         />
         <Text position="absolute" left="50%" top={0}>{progress + '%'}</Text>
      </Pane>
   );
}

export default ProgressBar;
