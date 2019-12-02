import React, { useMemo, Fragment, useState, useCallback } from 'react';
import Task from './Task';
import TopBar from './TopBar';
import './User.css';
import { OrderedList, Pane } from 'evergreen-ui'

/** Возможные состояния задачи */
const STATUS_DONE = 'done';
const STATUS_PROCESSING = 'processing';
const STATUS_CLOSED = 'closed';

const initialTasks = [
    {
        id: 0,
        theme: 'Знакомство с online.sbis.ru',
        description: 'Авторизуйтесь на online.sbis.ru',
        status: 'done',
        hint: 'подсказка 1',
    },
    {
        id: 1,
        theme: 'Знакомство с online.sbis.ru',
        description: 'Перейдите в календарь',
        status: 'done',
        hint: 'подсказка 2',
    },
    {
        id: 2,
        theme: 'Создаем первый мерж-реквест',
        description: 'Перейдите в задачи',
        status: 'done',
        hint: 'подсказка 3',
    },
    {
        id: 3,
        theme: 'Создаем первый мерж-реквест',
        description: 'Открыть любую задачу',
        status: 'processing',
        hint: 'подсказка 1',
     },
     {
        id: 4,
        theme: 'Создаем первый мерж-реквест',
        description: 'Связанные',
        status: 'closed',
     },
     {
        id: 5,
        theme: 'Создаем первый мерж-реквест',
        description: 'Найти Merge request',
        status: 'closed',
        hint: 'подсказка 1',
     },
     {
        id: 6,
        theme: 'Задаем вопрос на сервисе Вопрос-ответ',
        description: 'Переходим в группы',
        status: 'closed',
        hint: 'подсказка 1',
     },
     {
        id: 7,
        theme: 'Задаем вопрос на сервисе Вопрос-ответ',
        description: 'Wasaby framework',
        status: 'closed',
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
       return result;
    }, [items]);
}

/** Текущее задание */
function getProcessingItem(items) {
   const processingItem = items.find(item => {
      if (item.status === STATUS_PROCESSING) {
         return item;
      }
   });

   return processingItem;
}

function LearningPage({ history }) {
    const [items, setItems] = useState(initialTasks);
    const groupedTasks = useGroupedItems(items);

    /** Смена текущего задания для выполнения */
    const changeProcessingItem = useCallback(
        () => {
            const currentProcessingItem = getProcessingItem(items);
            if (!currentProcessingItem) {
                return;
            }
            const newItems = items.slice();
            
            // смена у только что пройденного задания статуса на "Выполнен"
            let newItem = { ...currentProcessingItem, status: STATUS_DONE };
            newItems[items.indexOf(currentProcessingItem)] = newItem;

            // Если есть еще задания для выполнения, то статус "В процессе" получает следущее задание
            if (currentProcessingItem.id !== items.length - 1) {
                const newProcessingItem = items[currentProcessingItem.id + 1];
                newItem = { ...newProcessingItem, status: STATUS_PROCESSING };
                newItems[items.indexOf(newProcessingItem)] = newItem;
            }
            setItems(newItems);
        },
        [items]
    );

    return (
        <Pane
            background="purpleTint">
            <TopBar history={ history } />
            <Pane
                padding={30}
                marginRight={80}
                marginLeft={80}
                elevation={2}
                background="white"
                className="User-LearningPage__height-90vh"
            >
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
                                                status={item.status}
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
            <button onClick={changeProcessingItem}>Событие - пройден пункт</button>
        </Pane>
    );
}

export default LearningPage;