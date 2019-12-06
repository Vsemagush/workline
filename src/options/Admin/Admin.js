import React, { useRef, useEffect, useCallback } from 'react';
import { Pane } from 'evergreen-ui';
import DataBase from '../../storage/db'
function Admin() {

   const data = useRef();
   useEffect(
      ()=> {
         data.current = new DataBase()
      },[]
   );

   const saveItem = useCallback(function (item){
      data.current.updateTask(item.id,item)
   });

   return (
      <Pane background="#DDEBF7">
         <button onClick={ ()=> saveItem({id:0,description:'1',theme:'2',additional: '3',type: '4',event:'5'})}>
            Проверка
         </button>
      </Pane>
   );
}

export default Admin;
