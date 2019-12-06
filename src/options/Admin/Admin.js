import React from 'react';
import TopBar from '../TopBar/TopBar';
import { Pane } from 'evergreen-ui';

function Admin() {
   return (
      <Pane background="#DDEBF7">
         <TopBar caption="Администрирование" />
      </Pane>
   );
}

export default Admin;
