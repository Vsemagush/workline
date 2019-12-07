import React, {
   useRef,
   useEffect,
   useState,
   useCallback,
   useMemo,
   Fragment
} from 'react';
import DataBase from '../../storage/db';
import { Pane, Select, IconButton, UnorderedList, ListItem, Button } from 'evergreen-ui';
import EditingItem from './EditingItem';
import EditDialog from './EditDialog';
import TopBar from '../TopBar/TopBar'

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
      data.current.subscribeChanges('tasks', (result) => {
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

   const deleteGroup = useCallback((groupItems) => {
      data.current.removeTasks(groupItems.map((item) => {
         return item.id;
      }));
   }, []);

   return (
      <Pane height="100vh" overflow="hidden">
         <TopBar caption="Администрирование" />
         <Pane display="flex" alignItems="center" justifyContent="center" className="invscroll" overflow="auto">
            <Pane display="flex" flexDirection="column">
               <UnorderedList>
                  {groupedTasks.map((group) => {
                     return (
                        <Fragment key={group.id}>
                           <ListItem listStyleType="none" display="flex" alignItems="center">
                              <EditingItem
                                 onSave={(text) => {
                                    saveGroup(group.theme, text);
                                 }}
                                 newup={group.theme}
                                 size={600}
                              />
                              <IconButton icon="plus" onClick={() => data.current.createTask({
                                 description: 'Новое задание',
                                 theme: group.theme
                              })} appearance="minimal" />
                              <IconButton icon="cross" intent="danger" onClick={() => { deleteGroup(group.items) }} appearance="minimal" />
                           </ListItem>
                           <ListItem listStyleType="none">
                              <UnorderedList>
                                 {group.items.map((item) => {
                                    return (
                                       <ListItem key={item.id} listStyleType="none" display="flex" alignItems="center" margin={10}>
                                          <EditingItem
                                             onSave={(text) => {
                                                item.description = text;
                                                saveItem(item);
                                             }}
                                             newup={item.description}
                                             size={500}
                                          />

                                          <Select value={item.event} onChange={(event) => {
                                             item.event = event.target.value;
                                             saveItem(item);
                                          }
                                          }
                                             marginLeft={10}
                                             maxWidth={200}
                                             minWidth={170}
                                          >

                                             {events.map((text) => {
                                                return <option value={text} key={text}>{text}</option>;
                                             })}
                                          </Select>
                                          <Button
                                             iconBefore="info-sign" paddingRight={0}
                                             onClick={() => {
                                                setEditElement(item);
                                             }}
                                             appearance="minimal"
                                          />
                                          <IconButton icon="cross" onClick={() => { deleteTask(item.id) }} intent="danger" appearance="minimal" />
                                       </ListItem>
                                    );
                                 })}
                              </UnorderedList>
                           </ListItem>
                        </Fragment>
                     );
                  })}
               </UnorderedList>
               <IconButton icon="plus" onClick={() => data.current.createTask({
                  description: 'Новое задание',
                  theme: "Новая тема"
               })} appearance="minimal" />
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
         </Pane>
      </Pane>
   );
}
export default Admin;
