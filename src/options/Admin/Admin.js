import React, { useMemo, useState, useCallback, Fragment } from 'react';
import './Admin.css';
import ListItem from './ListItem';
import EditableItem from '../EditableItem/EditableItem';
import AddButton from './AddButton';

const initialTasks = [
   {
      id: 0,
      theme: 'Знакомство с online.sbis.ru',
      description: 'Авторизуйтесь на online.sbis.ru',
   },
   {
      id: 1,
      theme: 'Знакомство с online.sbis.ru',
      description: 'Перейдите в контакты',
   },
   {
      id: 2,
      theme: 'Работа с задачами',
      description: 'Создайте ошибку',
   },
];
let currentId = initialTasks.length;

function useGroupedItems(items) {
   return useMemo(() => {
      const groups = new Map();
      items.forEach((item) => {
         if (!groups.has(item.theme)) {
            groups.set(item.theme, []);
         }
         groups.get(item.theme).push(item);
      });
      const result = [];
      groups.forEach((itemsInTheGroup, key) => {
         result.push({
            id: key + 'group',
            description: key,
            items: itemsInTheGroup,
         });
      });
      return result;
   }, [items]);
}

function Admin() {
   const [items, setItems] = useState(initialTasks);
   const groupedTasks = useGroupedItems(items);

   // Каждый коллбек относится к данным как будто они иммутабельные, чтобы реакт мог правильно отслеживать изменения
   // Отсюда все клонирования массивов\объектов вместо их изменения
   const saveItem = useCallback(
      (item, newText) => {
         const newItem = { ...item, description: newText };
         const newItems = items.slice();
         newItems[items.indexOf(item)] = newItem;
         setItems(newItems);
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
         const newItems = items.slice();
         newItems.push({
            id: currentId++,
            theme: group.description,
            description: 'Новое задание',
         });
         setItems(newItems);
      },
      [items],
   );

   const addNewGroup = useCallback(() => {
      const newItems = items.slice();
      newItems.push({
         id: currentId++,
         theme: 'Новая группа',
         description: 'Новое задание',
      });
      setItems(newItems);
   }, [items]);

   return (
      <div className="Admin__list">
         {groupedTasks.map((group) => {
            return (
               <Fragment key={group.id}>
                  <EditableItem
                     cssClass="Admin__listItem_group"
                     initialText={group.description}
                     onSave={(text) => {
                        saveGroup(group.description, text);
                     }}
                     Template={ListItem}
                  ></EditableItem>
                  {group.items.map((item) => {
                     return (
                        <EditableItem
                           key={item.id}
                           cssClass="Admin__listItem"
                           initialText={item.description}
                           onSave={(text) => {
                              saveItem(item, text);
                           }}
                           Template={ListItem}
                        ></EditableItem>
                     );
                  })}
                  <AddButton
                     cssClass="Admin__addButton_group"
                     onClick={() => {
                        addItemToGroup(group);
                     }}
                     caption="Добавить задание"
                  />
               </Fragment>
            );
         })}
         <AddButton
                     onClick={() => {
                        addNewGroup();
                     }}
                     caption="Добавить тему"
                  />
      </div>
   );
}

export default Admin;
