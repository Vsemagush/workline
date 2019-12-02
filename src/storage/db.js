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
    * @returns {Promise<object>}
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
    * @returns {Promise<object>}
    */
   createTask(data) {
      const format = this.getFormatTask();
      const taskData = Object.assign(format, data);
      const ref = this.set('tasks/task-' + taskData.id, taskData);
      return ref.then((res) => res);
   }

   /**
    * Создание данных узла, при отсутствии данных выбрасывает ошибку (опасно, возможна потеря данных DB)
    * @param {String} field
    * @returns {Promise<object>}
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
    * @returns {Promise<object>}
    */
   setTask(field, data) {
      return this.set('tasks/' + field, data);
   }

   /**
    * Обновление задачи
    * @param {String} key
    * @param {Object} data
    * @returns {Promise<object>}
    */
   updateTask(key, data) {
      const updates = {};
      updates[`${this._root}/tasks/${key}`] = data;

      return this._db.ref().update(updates);
   }

   /**
    * Удалить задачу
    * @param {String} key
    * @returns {Promise} 
    */
   removeTask(key) {
      return this._db.ref(`/tasks/${key}`).remove();
   }

   /**
    * Добавляет статус задачи
    * @param {String} taskId 
    * @param {String} user 
    * @param {String} state 
    * @returns {Promise<object>}
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
    * @returns {Promise<object>}
    */
   getState() {
      const user = this.getUser();
      return this.get(`/progress/${user}`);
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
    * @returns {Array<object|null>}  
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
