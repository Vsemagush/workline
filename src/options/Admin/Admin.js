import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import DataBase from '../../storage/db'
import { Pane } from 'evergreen-ui';
import EditingItem from './EditingItem'

function Admin() {
   const [taskList, setTaskList] = useState([]);

   const groupedTasks = useMemo(function group() {
      var nev = [];
      for (var i = 0; i < taskList.length; i++) {
         const theme = nev.find((element) => { return element.theme == taskList[i].theme })
         if (theme != null) {
            theme.items.push(taskList[i])
         }
         else {
            nev.push({
               theme: taskList[i].theme,
               id: taskList[i].theme,
               items: [taskList[i]]
            });
         }
      }
      return nev;
   }, [taskList]);

   const data = useRef();
   const saveItem = useCallback(function (item) {
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

   const saveGroup = useCallback(function (oldName, newName) {
      let newData = {};
      for (var i = 0; i < taskList.length; i++) {
         if (taskList[i].theme === oldName) {
            taskList[i].theme = newName;
            newData[taskList[i].id] = taskList[i];
         }
      }
      data.current.updateTasks(newData);
   }, [taskList]);



   return (
      <Pane background="#DDEBF7">
         <ul>
            {groupedTasks.map((group) => {
               return (
                  <li key={group.id}>
                     <EditingItem
                        onSave={(text) => {
                           saveGroup(group.theme, text);
                        }}
                        newup={group.theme}
                     />
                     <ul>
                        {group.items.map((item) => {
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
      </Pane >
   );
}
export default Admin;
