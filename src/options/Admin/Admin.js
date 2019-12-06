import React, { useRef, useEffect, useState } from 'react';
import DataBase from '../../storage/db'
import { Pane } from 'evergreen-ui';




function Admin() {

   const [taskList, setTaskList] = useState([]);


   const data = useRef();
   useEffect(
      () => {
         data.current = new DataBase();

         data.current.get('tasks').then(
            (result) => {
               var array = data.current.toArray(result);
               setTaskList(array);
            });

         console.log(data);
      }, []);

   return (
      <Pane background="#DDEBF7">
         <ul>

            {taskList.map((item) => {
               return (<li key={item.id}>{item.description}</li>);
            })}
         </ul>

      </Pane>
   );
}

export default Admin;
