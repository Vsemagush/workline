import React, { useRef, useEffect, useCallback } from 'react';
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

   const saveGroup = useCallback(function(items){
      data.current.updateTask(items.description,items)
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
         <button onClick={ ()=> saveGroup({id:0,description:'1',theme:'2',additional: '3',type: '4',event:'5'})}>
            проверка_проверочка
         </button>
      </Pane>
   );
}

export default Admin;
