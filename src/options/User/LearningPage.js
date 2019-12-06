import React, { useMemo, useEffect, useState, useRef } from 'react';
import './User.css';
import DataBaseApi from '../../storage/db';

/** Возможные состояния задачи */
const STATE_DONE = 'done';
const STATE_PROCESSING = 'processing';
const STATE_CLOSED = 'closed';

/** Форматирование списка задач - группировка со статусами */
function useGroupedItems(items) {
   return useMemo(() => {
      /** Группируем задачи по темам */
      var data = {};
      for (let item of items) {
         if (item.theme in data)
            data[item.theme].push(item);
         else
            data[item.theme] = [item];
      }

      /** Формируем список тем*/
      var themes = [];

      for (let theme of Object.keys(data)) {
         var obj = {
            id: theme,
            theme: theme,
            items: data[theme],
         };

         /** Определяем статус */
         var wasProcessing = false;
         var doneCount = 0;
         for (let item of obj.items) {
            if (item.state===STATE_PROCESSING) {
               wasProcessing = true;
               break;
            }

            if (item.state===STATE_DONE)
               doneCount++
         }
         if (wasProcessing) {
            obj.state = STATE_PROCESSING;
         } else if (doneCount === obj.items.length) {
            obj.state = STATE_DONE;
         } else {
            obj.state = STATE_CLOSED;
         }

         themes.push(obj);
      }

      if ((themes.length > 0) &&
         (themes[0].items.length > 0) &&
         !('state' in themes[0].items[0])) {
         themes[0].items[0].state = STATE_PROCESSING;
         themes[0].state = STATE_PROCESSING;
      }
      return themes;

   }, [items]);
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
