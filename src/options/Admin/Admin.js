import React, {
   useRef,
   useEffect,
   useState,
   useCallback,
   useMemo,
} from 'react';
import DataBase from '../../storage/db';
import { Pane, Icon, Select, IconButton } from 'evergreen-ui';
import EditingItem from './EditingItem';
import EditDialog from './EditDialog';

function Admin() {
   const [taskList, setTaskList] = useState([]);
   const [editElement, setEditElement] = useState();
   const [events, setEvents] = useState();

   const groupedTasks = useMemo(
      function group() {
         var nev = [];
         for (var i = 0; i < taskList.length; i++) {
            const theme = nev.find((element) => {
               return element.theme == taskList[i].theme;
            });
            if (theme != null) {
               theme.items.push(taskList[i]);
            } else {
               nev.push({
                  theme: taskList[i].theme,
                  id: taskList[i].theme,
                  items: [taskList[i]],
               });
            }
         }
         return nev;
      },
      [taskList],
   );

   const data = useRef();
   const saveItem = useCallback(function (item) {
      data.current.updateTask(item.id, item);
   }, []);

   useEffect(() => {
      data.current = new DataBase();
      setEvents(data.current.getEvent());
      data.current.get('tasks').then((result) => {
         var array = data.current.toArray(result);
         setTaskList(array);
      });
   }, []);

   const saveGroup = useCallback(
      function (oldName, newName) {
         let newData = {};
         for (var i = 0; i < taskList.length; i++) {
            if (taskList[i].theme === oldName) {
               taskList[i].theme = newName;
               newData[taskList[i].id] = taskList[i];
            }
         }
         data.current.updateTasks(newData);
      },
      [taskList],
   );

   const deleteTask = useCallback((key) => {
      data.current.removeTask(key);
   }, []);

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
                     <IconButton icon="plus" color="green" size={20} onClick={() => data.current.createTask({
                        description: 'Новое задание',
                        theme: group.theme
                     })} />
                     <ul>
                        {group.items.map((item) => {
                           return (
                              <li key={item.id}>
                                 <EditingItem
                                    onSave={(text) => {
                                       item.description = text;
                                       saveItem(item);
                                    }}
                                    newup={item.description}
                                 />
                                 <IconButton
                                    icon="info-sign"
                                    color="info"
                                    marginLeft={16}
                                    onClick={() => {
                                       setEditElement(item);
                                    }}
                                 />
                                 <Select onChange={(event) => {
                                    item.event = event.target.value;
                                    saveItem(item);
                                 }
                                 }>
                                    {events.map((text) => {
                                       return <option value={text} key={text}>{text}</option>;
                                    })}
                                 </Select>
                                 <IconButton icon="cross" color="red" size={20} onClick={() => { deleteTask(item.id) }} />
                              </li>
                           );
                        })}
                     </ul>
                  </li>
               );
            })}
         </ul>
         {editElement && (
            <EditDialog
               text={editElement.additional}
               onConfirm={(text) => {
                  editElement.additional = text;
                  saveItem(editElement);
               }}
               onCloseComplete={() => setEditElement()}
            />
         )}

      </Pane>
   );
}
export default Admin;
