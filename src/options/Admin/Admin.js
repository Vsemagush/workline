import { Dialog, IconButton, Table, Textarea } from 'evergreen-ui';
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

let currentId = 0;

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
   const [isDialogShown, setIsDialogShown] = useState(false);

   const [items, setItems] = useState();
   const groupedTasks = useGroupedItems(items);

   const db = useRef();
   useEffect(() => {
      let isCancelled = false;
      db.current = new DataBaseApi('test-adminpage');
      db.current.get('tasks').then((result) => {
         // Если компонент уничтожится раньше, чем прилетят данные, то нет смысла менять состояние
         if (isCancelled) {
            return;
         }
         const newItems = result
            ? Object.entries(result).map(([id, value]) => {
                 return {
                    id,
                    ...value,
                 };
              })
            : [];
         setItems(newItems);
      });

      return () => {
         isCancelled = true;
      };
   }, []);

   // Каждый коллбек относится к данным как будто они иммутабельные, чтобы реакт мог правильно отслеживать изменения
   // Отсюда все клонирования массивов\объектов вместо их изменения
   const saveItem = useCallback(
      (item, newText) => {
         let isCancelled = false;
         const newTask = { ...item, description: newText };
         db.current.updateTask(item.id, newTask).then(() => {
            if (isCancelled) {
               return;
            }
            const newItems = items.slice();
            newItems[items.indexOf(item)] = newTask;
            setItems(newItems);
         });

         return () => {
            isCancelled = true;
         };
      },
      [items],
   );

   const saveGroup = useCallback(
      (groupName, newText) => {
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
         let isCancelled = false;
         const task = db.current.createTask({
            theme: group.description,
            description: 'Новое задание',
         });

         db.current.setTask(task.id, task).then(() => {
            if (isCancelled) {
               return;
            }
            const newItems = items.slice();
            newItems.push(task);
            setItems(newItems);
         });

         return () => {
            isCancelled = true;
         };
      },
      [items],
   );

   const addNewGroup = useCallback(() => {
      let isCancelled = false;
      const task = db.current.createTask({
         theme: 'Новая группа',
         description: 'Новое задание',
      });

      db.current.setTask(task.id, task).then(() => {
         if (isCancelled) {
            return;
         }
         const newItems = items.slice();
         newItems.push(task);
         setItems(newItems);
      });

      return () => {
         isCancelled = true;
      };
   }, [items]);

   return (
      <Fragment>
         <Table>
            <Table.Body>
               {groupedTasks.map((group) => {
                  return (
                     <Fragment key={group.id}>
                        <Table.Row isHighlighted={true}>
                           <EditableItem
                              initialText={group.description}
                              onSave={(text) => {
                                 saveGroup(group.description, text);
                              }}
                           ></EditableItem>
                           <Table.Cell flex="none">
                              <AddButton
                                 onClick={() => {
                                    addItemToGroup(group);
                                 }}
                              />
                           </Table.Cell>
                        </Table.Row>
                        {group.items.map((item) => {
                           return (
                              <Table.Row key={item.id}>
                                 <EditableItem
                                    initialText={item.description}
                                    onSave={(text) => {
                                       saveItem(item, text);
                                    }}
                                    marginLeft="10px"
                                 ></EditableItem>
                                 <Table.Cell flex="none">
                                    <IconButton
                                       icon="info-sign"
                                       onClick={() => setIsDialogShown(true)}
                                    />
                                 </Table.Cell>
                              </Table.Row>
                           );
                        })}
                     </Fragment>
                  );
               })}
            </Table.Body>
         </Table>
         <AddButton
            onClick={() => {
               addNewGroup();
            }}
         />
         <Dialog
            title="Редактирование подсказки"
            isShown={isDialogShown}
            onCloseComplete={() => setIsDialogShown(false)}
         >
            <Textarea />
         </Dialog>
      </Fragment>
   );
}

export default Admin;
