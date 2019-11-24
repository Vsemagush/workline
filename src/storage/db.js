import * as firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/database';

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

class DataBaseApi {
   constructor() {
      this._db = database;
   }

   /**
    * Возвращает формат данных для вставки задачи
    */
   getFormatTask() {
      return {
         id: Date.now(), // уникальный идентификатор
         description: '', // описание задачи
         theme: '', // раздел обучения, уникальная тема
         additional: '', // дополнительные данные (подсказки)
         type: '', // должность
      };
   }

   /**
    * Получение данных узла, по умолчанию возвращает все
    * @param {String} field
    * @returns {Promise}
    */
   get(field = '') {
      const ref = this._db
         .ref('/' + field)
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
    * Создание данных узла, при отсутствии данных выбрасывает ошибку (опасно, возможна потеря данных DB)
    * @param {String} field
    * @returns {Promise}
    */
   set(field, data) {
      if (field) {
         const ref = this._db.ref('/' + field).set(data, function(error) {
            if (error) {
               return error;
            } else {
               return true;
            }
         });
         return ref;
      } else {
         throw Error(
            'Попытка перезаписать корень хранилища, операция запрещена!',
         );
      }
   }

   /**
    * Запись задачи
    * @param {String} field
    * @returns {Promise}
    */
   setTask(field, data) {
      return this.set('tasks/' + field, data);
   }

   /**
    * Обновление задачи
    * @param {String} key
    * @param {Object} data
    * @returns {Promise}
    */
   updateTask(key, data) {
      var updates = {};
      updates['/tasks/' + key] = data;

      return this._db.ref().update(updates);
   }

   /**
    * Удалить задачу
    * @param {String} key 
    */
   removeTask(key) {
      return this._db.ref('/tasks/' + key).remove();
   }
}

export default DataBaseApi;
