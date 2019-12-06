import React from 'react';
import { Pane } from 'evergreen-ui';

function group(items) {
   var nev = [];
  
   for (var i = 0; i < items.length; i++) {
      const theme = nev.find((element) => { return element.theme == items[i].theme })
      if (theme) {
         theme.items.push(items[i])
      }
      else {
         nev.push({
            themeName: items[i].theme,
            id: items[i].theme,
            items: [items[i]]
         });
      }
   }
   return nev;
}

function Admin() {
   return (
      <Pane background="#DDEBF7">
         <TopBar caption="Администрирование" />
      </Pane>
   );
}

export default Admin;
