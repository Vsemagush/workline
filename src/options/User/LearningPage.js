import React, { useMemo, Fragment, useState, useCallback, useRef, useEffect } from 'react';
import Task from './Task';
import TopBar from './TopBar';
import './User.css';
import { OrderedList, Pane } from 'evergreen-ui';
import DataBaseApi from '../../storage/db';
import ProgressBar from "./ProgressBar";
import ContentChannel from './../Channel';

/** Возможные состояния задачи */
const STATUS_DONE = 'done';
const STATUS_PROCESSING = 'processing';
const STATUS_CLOSED = 'closed';

function useGroupedItems(items) {
    return useMemo(() => {
        const result = [];
        if (items && items.length) {
            // Последнее добавленное задание может относиться к первой группе, поэтому сначала группируем
            const groups = new Map();
            items.forEach((item) => {
                if (!groups.has(item.theme)) {
                    groups.set(item.theme, []);
                }
                groups.get(item.theme).push(item);
            });

            // Случай нового пользователя - первая задача становится в процессе
            // Порядок групп уже есть - нужен первый элемент первой группы
            const itemsInFirstGroup = groups.values().next().value;
            if (itemsInFirstGroup[0] && !itemsInFirstGroup[0].status) {
                itemsInFirstGroup[0].status = STATUS_PROCESSING;
            }

            // Актуализируем информацию по статусам групп
            groups.forEach((itemsInTheGroup, key) => {
                let totalReadyInGroup = 0;
                let processing = false;
                let groupStatus = STATUS_CLOSED;
                itemsInTheGroup.forEach((item) => {
                    if (item.status === STATUS_DONE) totalReadyInGroup++;
                    if (item.status === STATUS_PROCESSING) processing = true;
                });
                if (totalReadyInGroup === itemsInTheGroup.length) {
                    groupStatus = STATUS_DONE;
                } else if (processing) {
                    groupStatus = STATUS_PROCESSING;
                }
                result.push({
                    id: key,
                    description: key,
                    items: itemsInTheGroup,
                    status: groupStatus,
                });
            });
        }
        return result;
    }, [items]);
}

function LearningPage() {
    const [items, setItems] = useState();
    const groupedTasks = useGroupedItems(items);

   const db = useRef();
   const channel = useRef();

    // Подключение к БД и загрузка данных
   useEffect(() => {
      db.current = new DataBaseApi('test-adminpage');
      const promises = [
         db.current.get('tasks'),
         db.current.getState()
      ];
      Promise.all(promises).then((result) => {
         const itemsFromDB = db.current.toArray(result[0]);
         const progressTasks = db.current.toArray(result[1]);
         if (progressTasks) {
            itemsFromDB.forEach((item) => { // Сопоставление прогреса к соответсвующей задаче
               let curTask = progressTasks.find(task => task.id.includes(item.id));
               item.status = curTask && curTask.state;
            });
         }
         setItems(itemsFromDB);
      });
   }, []);

   useEffect(() => {
      channel.current = new ContentChannel('user-event');
      const currentProcessingItemIndex = items && items.find(item => item.status === STATUS_PROCESSING);
      if (currentProcessingItemIndex) {
         channel.current.addListener(currentProcessingItemIndex.event, changeProcessingItem);
      }
   }, [items, currentProcessingItemIndex]);

    /** Смена текущего задания для выполнения */
    const changeProcessingItem = useCallback(() => {
           const currentProcessingItemIndex = items.findIndex(item => item.status === STATUS_PROCESSING);
           if (currentProcessingItemIndex === -1) {
               return;
           }
           const newItems = items.slice();
           const currentProcessingItem = newItems[currentProcessingItemIndex];

           channel.current.removeListener(currentProcessingItem.event);

           newItems.splice(currentProcessingItemIndex, 1, {
               ...currentProcessingItem,
               status: STATUS_DONE
           });
           db.current.setState(currentProcessingItem.id, STATUS_DONE);

           const group = groupedTasks.find((group) =>
              group.id === currentProcessingItem.theme
           );
           const indexInGroup = group.items.findIndex((item) => item.id === currentProcessingItem.id);
           let newItem;
           if (indexInGroup === group.items.length - 1) {
               const groupIndex = groupedTasks.findIndex((value) => value === group);
               if (groupIndex !== groupedTasks.length - 1) {
                  newItem = groupedTasks[groupIndex + 1].items[0];
               }
           } else {
               newItem = group.items[indexInGroup + 1];
           }

           if (newItem) {
              const newItemIndex = newItems.findIndex((item) => item === newItem);
              newItems.splice(newItemIndex, 1, {
                 ...newItems[newItemIndex],
                 status: STATUS_PROCESSING
              });
              db.current.setState(newItem.id, STATUS_PROCESSING);
           }

           setItems(newItems);
       }, [items, groupedTasks]);

    return (
        <Pane
            background="#DDEBF7">
            <TopBar history={ history } />
            <Pane
                padding={30}
                marginRight={80}
                marginLeft={80}
                elevation={2}
                background="white"
                className="User-LearningPage__height-90vh"
            >
               <ProgressBar progress={50} />
                <OrderedList>
                    {groupedTasks.map((group) => {
                        return (
                        <Fragment key={group.id}>
                                <hr />
                                <Task
                                    status={group.status}
                                    text={group.description}>
                                </Task>
                                {<OrderedList>
                                    {group.items.map((item) => {
                                        return (
                                            <Task
                                                key={item.id}
                                                hint={item.hint}
                                                subTask={true}
                                                status={item.status || STATUS_CLOSED}
                                                text={item.description}>
                                            </Task>
                                        );
                                    })}
                                </OrderedList>}

                        </Fragment>
                        );
                    })}
                </OrderedList>
            </Pane>


            {/* Временная имитация события для переключения пройденных заданий */}
            {/* <button onClick={changeProcessingItem}>Событие - пройден пункт</button> */}
        </Pane>
    );
}

export default LearningPage;
