import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import DataBase from '../../storage/db';
import { Pane } from 'evergreen-ui';

function Admin() {

   const [taskList, setTaskList] = useState([]);
   
   const groupedTasks = useMemo(function group() {
      var nev = [];
      for (var i = 0; i < taskList.length; i++) {
         const theme = nev.find((element) => { return element.theme == taskList[i].theme })
         if (theme!=null) {
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

      </Pane>
   );
}

export default Admin;

