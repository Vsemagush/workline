import { IconButton, OrderedList, ListItem, Pane, Select } from 'evergreen-ui';
import React, {
   Fragment,
   useCallback,
   useMemo,
   useState,
   useRef,
   useEffect,
} from 'react';
import EditableItem from '../EditableItem/EditableItem';
import AddButton from './AddButton';
import DataBaseApi from '../../storage/db';
import TopBar from './TopBar';
import EditDialog from './EditDialog';

function useGroupedItems(items) {
   return useMemo(() => {
      const result = [];
      if (items) {
         const groups = new Map();
         items.forEach((item) => {
            if (!groups.has(item.theme)) {
               groups.set(item.theme, []);
            }
            groups.get(item.theme).push(item);
         });
         groups.forEach((itemsInTheGroup, key) => {
            result.push({
               id: key,
               description: key,
               items: itemsInTheGroup,
            });
         });
      }
      return result;
   }, [items]);
}

function Admin() {
   // Используется для прокидывания значения редактируемого элемента в диалог редактирования
   const [currentEditingItem, setCurrentEditingItem] = useState();

   const [items, setItems] = useState();
   const [events, setEvents] = useState();
   const groupedTasks = useGroupedItems(items);

   const db = useRef();
   // подключаемся к БД и грузим данные
   useEffect(() => {
      db.current = new DataBaseApi();
      db.current.get('tasks').then((result) => {
         setEvents(db.current.getEvent());
         setItems(db.current.toArray(result));
      });
   }, []);

   // По сути здесь начинаются обработчики событий
   // Каждый коллбек относится к данным как будто они иммутабельные, чтобы реакт мог правильно отслеживать изменения
   // Отсюда все клонирования массивов\объектов вместо их изменения
   const saveItem = useCallback(
      (item, field, newText) => {
         const newTask = { ...item, [field]: newText };
         db.current.updateTask(item.id, newTask).then(() => {
            const newItems = items.slice();
            newItems[items.indexOf(item)] = newTask;
            setItems(newItems);
         });
      },
      [items],
   );

   const saveGroup = useCallback(
      (groupName, newText) => {
         const updatedTasks = {};
         const newItems = items.map((item) => {
            if (item.theme === groupName) {
               const result = {
                  ...item,
                  theme: newText,
               };
               updatedTasks[item.id] = result;
               return result;
            } else {
               return item;
            }
         });

         db.current.updateTasks(updatedTasks).then(() => {
            setItems(newItems);
         });
      },
      [items],
   );

   const addItemToGroup = useCallback(
      (group) => {
         const task = db.current
            .createTask({
               theme: group.description || null,
               description: 'Новое задание',
            })
            .then(() => {
               const newItems = items.slice();
               newItems.push(task);
               setItems(newItems);
            });
      },
      [items],
   );

   const addNewGroup = useCallback(() => {
      db.current
         .createTask({
            theme: 'Новая группа',
            description: 'Новое задание',
         })
         .then((result) => {
            const newItems = items.slice();
            newItems.push(result);
            setItems(newItems);
         });
   }, [items]);

   const removeTask = useCallback(
      (itemId) => {
         db.current.removeTask(itemId).then(() => {
            const index = items.findIndex(({ id }) => id === itemId);
            if (index !== -1) {
               const newItems = items.slice();
               newItems.splice(index, 1);
               setItems(newItems);
            }
         });
      },
      [items],
   );

   const removeGroup = useCallback(
      (groupName) => {
         const itemsToRemove = items
            .filter((item) => item.theme === groupName)
            .map((item) => item.id);

         db.current.removeTasks(itemsToRemove).then(() => {
            setItems(items.filter((item) => !itemsToRemove.includes(item.id)));
         });
      },
      [items],
   );

   const setTaskEvents = useCallback(
      (item, event) => {
         const newTask = {
            ...item,
            event,
         };
         db.current.updateTask(item.id, newTask).then(() => {
            const newItems = items.slice();
            newItems[items.indexOf(item)] = newTask;
            setItems(newItems);
         });
      },
      [items],
   );

   return (
      <Pane background="#DDEBF7">
         <TopBar caption="Администрирование" />
         <Pane
            padding={30}
            marginRight={80}
            marginLeft={80}
            elevation={2}
            background="white"
         >
            <OrderedList>
               {groupedTasks.map((group) => {
                  return (
                     <Fragment key={group.id}>
                        <ListItem
                           display="flex"
                           alignItems="center"
                           margin={18}
                        >
                           <EditableItem
                              initialText={group.description}
                              onSave={(text) => {
                                 saveGroup(group.description, text);
                              }}
                              fontSize={600}
                           />
                           <AddButton
                              onClick={() => {
                                 addItemToGroup(group);
                              }}
                              tooltip="Добавить задачу"
                           />
                           <IconButton
                              icon="cross"
                              appearance="minimal"
                              title="Удалить тему"
                              onClick={() => {
                                 removeGroup(group.id);
                              }}
                           />
                        </ListItem>
                        <OrderedList>
                           {group.items.map((item) => {
                              return (
                                 <ListItem
                                    key={item.id}
                                    display="flex"
                                    alignItems="center"
                                    margin={18}
                                 >
                                    <EditableItem
                                       initialText={item.description}
                                       onSave={(text) => {
                                          saveItem(item, 'description', text);
                                       }}
                                       fontSize={500}
                                    />
                                    <Select
                                       marginLeft={10}
                                       width={240}
                                       maxWidth={240}
                                       items={events}
                                       value={item.event}
                                       onChange={(event) => {
                                          setTaskEvents(
                                             item,
                                             event.target.value,
                                          );
                                       }}
                                    >
                                       {events.map((event) => (
                                          <option value={event} key={event}>
                                             {event}
                                          </option>
                                       ))}
                                    </Select>
                                    <IconButton
                                       icon="info-sign"
                                       appearance="minimal"
                                       title="Редактировать подсказку"
                                       onClick={() => {
                                          setCurrentEditingItem(item);
                                       }}
                                    />
                                    {group.items.length > 1 && (
                                       <IconButton
                                          icon="cross"
                                          appearance="minimal"
                                          title="Удалить задачу"
                                          onClick={() => {
                                             removeTask(item.id);
                                          }}
                                       />
                                    )}
                                 </ListItem>
                              );
                           })}
                        </OrderedList>
                     </Fragment>
                  );
               })}
            </OrderedList>
            <AddButton
               onClick={() => {
                  addNewGroup();
               }}
               tooltip="Добавить группу"
            />
            {currentEditingItem && (
               <EditDialog
                  initialText={currentEditingItem.additional}
                  isShown={true}
                  onSave={(text) => {
                     saveItem(currentEditingItem, 'additional', text);
                     setCurrentEditingItem();
                  }}
                  onCancel={() => {
                     setCurrentEditingItem();
                  }}
               />
            )}
         </Pane>
      </Pane>
   );
}

export default Admin;
