import React, { useRef, useEffect, useState, useCallback } from 'react';
import DataBase from '../../storage/db'
import { Pane } from 'evergreen-ui';
import EditingItem from './EditingItem'

function Admin() {
   const [taskList, setTaskList] = useState([]);
   const data = useRef();
   const saveItem = useCallback(function(item) {
      data.current.updateTask(item.id, item);
   });

   useEffect(
      () => {
         data.current = new DataBase();
         data.current.get('tasks').then(
            (result) => {
               var array = data.current.toArray(result);
               setTaskList(array);
            });
      }, []);

   const saveGroup = useCallback(function(oldName, newName) {
      let newData = {};
      for (var i = 0; i < taskList.length; i++) {
         if (taskList[i].theme === oldName) {
            taskList[i].theme = newName;
            newData[taskList[i].id] = taskList[i];
         }
      }
      data.current.updateTasks(newData);
   });

   return (
      <Pane background="#DDEBF7">
         <ul>
            {taskList.map((item) => {
               return (
                  <li key={item.id} >
                     <EditingItem
                        onSave={(text) => {
                           item.description = text;
                           saveItem(item);
                        }}
                        newup={item.description}
                     />
                  </li>
               );
            })}
         </ul>

         <button onClick={() => saveGroup('55', '2837')}>
            проверка_saveGroup
         </button>

         <button onClick={() => saveItem({ id: 0, description: '1', theme: '2', additional: '3', type: '4', event: '5' })}>
            Проверка
         </button>
      </Pane>
   );
}
export default Admin;
