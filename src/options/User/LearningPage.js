import React, { useMemo } from 'react';
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

    return (
        <div></div>
    );
}

export default LearningPage;
