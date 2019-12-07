import React, { useRef, useEffect, useCallback,useState } from 'react';
import { Pane } from 'evergreen-ui';
import DataBase from '../../storage/db'
function Admin() {

   const [taskList, setTaskList] = useState([]);


   const data = useRef();


   const saveItem = useCallback(function (item) {
      data.current.updateTask(item.id, item)
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

   const saveGroup = useCallback(function(oldName,newName){
      for (var i = 0; i < taskList.length; i++){
         if (taskList[i].theme == oldName) {
            taskList[i].theme = newName;
         }
      }
      data.current.updateTasks(taskList);
   });
   return (
      <Pane background="#DDEBF7">
         <ul>

            {taskList.map((item) => {
               return (<li key={item.id}>{item.description}</li>);
            })}
         </ul>

         <button onClick={() => saveItem({ id: 0, description: '1', theme: '2', additional: '3', type: '4', event: '5' })}>
            Проверка
         </button>
         <button onClick={ ()=> saveGroup('2','55')}>
            проверка_saveGroup
         </button>
      </Pane>
   );
}

export default Admin;
