import React, { useRef, useEffect, useState, useCallback } from 'react';
import DataBase from '../../storage/db'
import { Pane, Icon } from 'evergreen-ui';
import EditingItem from './EditingItem'
import EditDialog from './EditDialog'

function Admin() {

   const [taskList, setTaskList] = useState([]);
   const [editElement, setEditElement] = useState();
   const data = useRef();
   const saveItem = useCallback(function (item) {
      data.current.updateTask(item.id, item)
   }, []);

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
               return (
                  <li key={item.id} >
                     <EditingItem
                        onSave={(text) => {
                           item.description = text;
                           saveItem(item);
                        }}
                        newup={item.description}
                     />
                     <Icon icon="info-sign" color="info" marginLeft={16}
                        onClick={() => {
                           setEditElement(item);
                        }} />
                  </li>
               );
            })}
         </ul>
         {editElement && <EditDialog text={editElement.additional}
            onConfirm={(text) => {
               editElement.additional = text;
               saveItem(editElement);
            }}
            onCloseComplete={() => setEditElement()}
         />}
      </Pane>
   );
}

export default Admin;

