import React from 'react';
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

    return (
        <div>Hello,world</div>
    );
}

export default LearningPage;
