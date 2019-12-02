import * as firebase from 'firebase/app';

import 'firebase/auth'; // подключение к API firebase
import 'firebase/database'; // добавление плагинов по работе с базой

// конфиг из админке FireBase + нужно в настройках БД разрешить чтение/запись
// https://firebase.google.com/docs/database/security/quickstart?authuser=0
const serviceAccount = {
   apiKey: 'AIzaSyAg-V7r7CYcQ53AyTqOjybAan4wrhMoyFE',
   authDomain: 'workline-71bd0.firebaseapp.com',
   databaseURL: 'https://workline-71bd0.firebaseio.com',
   projectId: 'workline-71bd0',
   storageBucket: 'workline-71bd0.appspot.com',
   messagingSenderId: '38322499442',
   appId: '1:38322499442:web:204d70005f42e4cf2df7eb',
   measurementId: 'G-ESJ4STGKD2',
};

// создаем коннект к БД
firebase.initializeApp(serviceAccount);
const database = firebase.database();

// список событий, константный набор -  обработка их тут /src/controller/index.js
const EVENTS_ARRAY = [
   ''
];

/**
 * Доступ к API FireBase
 * Пример: const api = DataBaseApi();
 */
class DataBaseApi {

   /**
    * Уровень доступа к данным обучения, по умолчанию пишем на уровень "test"
    * @param {String} root 
    */
   constructor(root='test') {
      this._db = database;
      this._root = root ? `/${root}/`: '/' ;
      this._user = localStorage.getItem('userName') ? localStorage.getItem('userName') : 'demo-user';
      this._events = EVENTS_ARRAY;
   }

   /**
    * Возвращает формат данных для вставки задачи
    * @returns {Object}
    */
   getFormatTask() {
      return {
         id: Date.now(),  // уникальный идентификатор
         description: '', // описание задачи
         theme: '',       // раздел обучения, уникальная тема
         additional: '',  // дополнительные данные (подсказки)
         type: '',        // должность
         event: ''        // привязанное событие из controller/*
      };
   }

   /**
    * Получение данных узла, по умолчанию возвращает все
    * @param {String} field
    * @returns {Promise<Object|null>}
    */
   get(field = '') {
      const ref = this._db
         .ref(this._root + field)
         .once('value')
         .then(
            function(snapshot) {
               return snapshot.val();
            },
            function(error) {
               return error;
            },
         );

      return ref;
   }

   /**
    * Создание задачи - берет данные по формату
    * @param {Object} data 
    * @returns {Promise<Object|null>}
    */
   createTask(data) {
      const format = this.getFormatTask();
      const taskData = Object.assign(format, data);
      const ref = this.setTask(`task-${taskData.id}`, taskData);
      return ref.then((res) => res);
   }

   /**
    * Создание данных узла, при отсутствии данных выбрасывает ошибку (опасно, возможна потеря данных DB)
    * @param {String} field
    * @returns {Promise<Object|null>}
    */
   set(field, data) {
      if (field) {
         const ref = this._db.ref(this._root + field).set(data);
         return ref.then(() => data);
      } else {
         throw Error(
            'Попытка перезаписать корень хранилища, операция запрещена!',
         );
      }
   }

   /**
    * Запись задачи
    * @param {String} field
    * @returns {Promise<Object|null>}
    */
   setTask(field, data) {
      return this.set('tasks/' + field, data);
   }

   /**
    * Обновление задачи
    * @param {String} key
    * @param {Object} data
    * @returns {Promise<Object|null>}
    */
   updateTask(key, data) {
      const param = {};
      param[key] = data;
      return this.massOperations([key], param);
   }

   /**
    * Массовое обновление задач
    * @param {Object} data - список задач в формате {'task-1': {...}, ...}
    * @returns {Promise<null>} 
    */
   updateTasks(data) {
      return this.massOperations(null, data);
   }

   /**
    * Удалить конкретную задачу
    * @param {String|Number} key
    * @returns {Promise<null>} 
    */
   removeTask(key) {
      // Подпорка, если передали не путь до задач (task-123), а числовой id
      if (Number.isInteger(key)) {
         key = `task-${key}`;
      }
      return this._db.ref(`/tasks/${key}`).remove();
   }

   /**
    * Удаление задач по массиву ключей
    * @param {Array} keys 
    * @returns {Promise<null>} 
    */
   removeTasks(keys) {
      return this.massOperations(keys);
   }

   /**
    * Массовые операции с задачами
    * @param {Array} keys
    * @param {Object} data данные для массовой вставки
    * @returns {Promise<null>} 
    */
   massOperations(keys, data) {
      const updates = {};

      if (!keys && data) {
         keys = Object.keys(data);
      } else {
         if (!data) {
            throw Error('Недопустимый набор параметров, нужны ключи или данные')
         }
      }

      // переберем ключи и создадим набор обновляемых данных
      keys.forEach((key) => {
         updates[`${this._root}tasks/${key}`] = data ? data[key] : null;
      });

      return this._db.ref().update(updates);
   }

   /**
    * Добавляет статус задачи
    * @param {String} taskId 
    * @param {String} user 
    * @param {String} state 
    * @returns {Promise<Object|null>}
    */
   setState(taskId, state) {
      const updates = {};
      const user = this.getUser();
      const stateTask = {
         state,
         user
      };
      updates[ `${this._root}/progress/${user}/${taskId}`] = stateTask;
      return this._db.ref().update(updates);
   }
   
   /**
    * Список состояний по задачам
    * @returns {Promise<Object|null>}
    */
   getState() {
      const user = this.getUser();
      return this.get(`/progress/${user}`);
   }

   /**
    * Возвращает список поддерживаем событий
    * @returns {Array}
    */
   getEvent() {
      return this._events;
   }

   /**
    * Получить текущего пользователя
    * @returns {String}
    */
   getUser() {
      return this._user;
   }

   /**
    * Превращает объекты из БД в массив объектов с ключом внутри
    * [{id, ...values}, ...]
    * @param {Object} data
    * @returns {Array<Object|null>}  
    */
   toArray(data) {
      if (!data) {
         data = {};
      }
      return Object.entries(data).map(([id, value]) => {
         return { id, ...value };
      });
   }
}

export default DataBaseApi;
