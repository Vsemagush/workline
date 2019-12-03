import {
   IconButton,
   OrderedList,
   ListItem,
   Pane,
} from 'evergreen-ui';
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
               id: key + 'group',
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
   const groupedTasks = useGroupedItems(items);

   const db = useRef();
   // подключаемся к БД и грузим данные
   useEffect(() => {
      db.current = new DataBaseApi('test-adminpage');
      db.current.get('tasks').then((result) => {
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
         // TODO: звать метод БЛ, после того как он появится
         const newItems = items.map((item) => {
            if (item.group === groupName) {
               return {
                  ...item,
                  group: newText,
               };
            } else {
               return item;
            }
         });

         setItems(newItems);
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

   const removeTask = useCallback((itemId) => {
      // TODO: добавить удаление групп
      db.current.removeTask(itemId).then(() => {
         const index = items.findIndex(({ id }) => id === itemId);
         if (index !== -1) {
            const newItems = items.slice();
            newItems.splice(index, 1);
            setItems(newItems);
         }
      });
   }, [items]);

   return (
      <Pane background="purpleTint">
         <TopBar caption="Администрирование" />
         <Pane
            padding={30}
            marginRight={80}
            marginLeft={80}
            elevation={2}
            background="white"
            height="90vh"
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
                                    <IconButton
                                       icon="info-sign"
                                       appearance="minimal"
                                       title="Редактировать подсказку"
                                       onClick={() => {
                                          setCurrentEditingItem(item);
                                       }}
                                    />
                                    {group.items.length > 1 && <IconButton
                                       icon="cross"
                                       appearance="minimal"
                                       title="Удалить задачу"
                                       onClick={() => {
                                          removeTask(item.id)
                                       }}
                                    />}
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
            {currentEditingItem && <EditDialog
               initialText={currentEditingItem.additional}
               isShown={true}
               onSave={(text) => {
                  saveItem(currentEditingItem, 'additional', text);
                  setCurrentEditingItem();
               }}
               onCancel={() => {
                  setCurrentEditingItem();
               }}
            />}
         </Pane>
      </Pane>
   );
}

export default Admin;
