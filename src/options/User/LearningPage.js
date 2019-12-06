import React, { useEffect, useState, useRef } from 'react';
import './User.css';
import DataBaseApi from '../../storage/db';

/** Возможные состояния задачи */
const STATUS_DONE = 'done';
const STATUS_PROCESSING = 'processing';
const STATUS_CLOSED = 'closed';

/** Форматирование списка задач - группировка со статусами */
function useGroupedItems(items) {
    return [];
}

/** Сопоставление задачам прогресс */
function useMatchingData(tasks, progress) {
      return {};
}

function LearningPage() {

    /** Смена текущего задания для выполнения */
    const changeProcessingItem = {};
    const db = useRef();
    const [items, setItems] = useState();
    const [progress, setProgress] = useState();

    /** Получение прогресса и задач из БД и подписка на их изменение */
    useEffect(() => {
        db.current = new DataBaseApi();
        db.current.subscribeChanges('tasks', (result) =>{
            setItems(db.current.toArray(result));
        });
        db.current.subscribeChanges('progress',(result) => {
            setProgress(db.current.toArray(result));
        });
    }, [])
    return (
        <div>Hello,world</div>
    );
}

export default LearningPage;
