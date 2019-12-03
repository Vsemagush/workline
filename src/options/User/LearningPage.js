import React, { useMemo, Fragment, useState, useCallback, useRef, useEffect } from 'react';
import Task from './Task';
import TopBar from './TopBar';
import './User.css';
import { OrderedList, Pane } from 'evergreen-ui';
import DataBaseApi from '../../storage/db';

/** Возможные состояния задачи */
const STATUS_DONE = 'done';
const STATUS_PROCESSING = 'processing';
const STATUS_CLOSED = 'closed';
 
function useGroupedItems(items) {
    return useMemo(() => {
        const result = [];
        const sortedItems = [];
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

            let index = 0;
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
                // Заодно сразу пересортируем (в порядке следования групп) задачи
                itemsInTheGroup.forEach((item) => {
                    item.index = index; // Нужен в последующем - брать следующее задания во время смены статуса
                    index++;
                    sortedItems.push(item);
                })
            });
        }
        return { result, sortedItems };
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

function LearningPage() {
    const [items, setItems] = useState();
    const res = useGroupedItems(items);

    const groupedTasks = res.result;
    const sortedItems = res.sortedItems;

    if (JSON.stringify(sortedItems) !== JSON.stringify(items)) {
        setItems(sortedItems);
    }

    const db = useRef();

    // Подключение к БД и загрузка данных
    useEffect(() => {
        db.current = new DataBaseApi();
        db.current.get('tasks').then((result) => {
            const items = db.current.toArray(result);
            db.current.getState().then((result) => { // Загрузка прогресса
                const progressTasks = db.current.toArray(result);
                if (progressTasks) {
                    items.forEach((item) => { // Сопоставление прогреса к соответсвующей задаче
                        let curTask = progressTasks.find(task => task.id === item.id)
                        item.status = curTask && curTask.state;
                    })
                }
                setItems(items);
            });
        });
    }, []);

    /** Смена текущего задания для выполнения */
    const changeProcessingItem = useCallback(
        () => {
            const currentProcessingItem = getProcessingItem(items);
            if (!currentProcessingItem) {
                return;
            }
            const newItems = items.slice();
            
            // смена у только что пройденного задания статуса на "Выполнен"
            db.current.setState(currentProcessingItem.id, STATUS_DONE);
            let newItem = { ...currentProcessingItem, status: STATUS_DONE };
            newItems[items.indexOf(currentProcessingItem)] = newItem;

            // Если есть еще задания для выполнения, то статус "В процессе" получает следущее задание
            if (currentProcessingItem.index !== items.length - 1) {
                const newProcessingItem = items[currentProcessingItem.index + 1];
                db.current.setState(newProcessingItem.id, STATUS_PROCESSING);
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
            <button onClick={changeProcessingItem}>Событие - пройден пункт</button>
        </Pane>
    );
}

export default LearningPage;