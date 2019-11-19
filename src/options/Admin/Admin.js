import React, { useMemo, Fragment } from 'react';
import './Admin.css';
import ListItem from './ListItem';
import EditableItem from '../EditableItem/EditableItem';

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
      theme: 'У меня не очень хорошая фантазия',
      description: 'Поэтому пока оставим так',
   },
];

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
   const groupedTasks = useGroupedItems(initialTasks);
   return (
      <div className="Admin__list">
         {groupedTasks.map((group) => {
            return (
               <Fragment key={group.id}>
                  <div>{group.description}</div>
                  {group.items.map((item) => {
                     return (
                        <EditableItem
                           key={item.id}
                           initialText={item.description}
                           onSave={(text) => {
                              item.description = text;
                           }}
                           Template={ListItem}
                        ></EditableItem>
                     );
                  })}
               </Fragment>
            );
         })}
      </div>
   );
}

export default Admin;
