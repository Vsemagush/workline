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
   'news_click-all-staff', // Открыть список всех сотрудников с главной страницы через поиск
   'contacts_click-new-message', // В разделе контактов создание сообщение и отправка его 
   'tasks_click-new-task', // В разделе задач - запуск задачи на выполнение
   'calendar_click-new-event', // В разделе календарь - создание события
   'news_like-click', // В разделе Новости нажатие на кнопку лайка
   'news_unlike-click', // В разделе Новости нажатие на кнопку дизлайка
   'news_post-open', // В разделе Новости открытие поп-апа при нажатие на новость
   'news_post-filter', // В разделе Новости получение новостей по фильтру
   'news_notification-open', // В разделе Новости открытие панели уведомлений
   'news_notification-hidden', // В раздели Новости скрытие панели уведомлений
   'tasks_click-new-task-dlyamenya', // Из on me Вы открыли свою первую задачу, заполните поля и продолжите работу!
   'tasks_click-create-new-task-dlyamenya', // Из on me Вы создали свою первую задачу, можете продолжать работу!
   'tasks_click-create-new-task-otmenya', // Из from me Вы создали свою первую задачу, можете продолжать работу!
   'tasks_click-delete-task-otmenya-yesout' // Из from me Вы удалили свою первую задачу, можете продолжать работу!

];

const DEFAULT_USER = 'demo-user';

/**
 * Доступ к API FireBase
 * Пример: const api = DataBaseApi();
 * База состоит из нескольких основных веток
 *    /tasks - список задач
 *    /progress - список состояний прогресса
 *    /users - список авторизованных пользователей
 */
class DataBaseApi {

   /**
    * Уровень доступа к данным обучения, по умолчанию пишем на уровень "test"
    * @param {String} root
    */
   constructor(root = 'test') {
      this._db = database;
      this._subscriber = {};
      this._root = root ? `/${root}/` : '/';
      this._user = localStorage.getItem('userName') ? localStorage.getItem('userName') : DEFAULT_USER;
      this._events = EVENTS_ARRAY;
   }

   /**
    * Возвращает формат данных для вставки задачи
    * @returns {Object}
    */
   getFormatTask() {
      // считаем что по умолчанию выбрано первое событие
      const event = this.getEvent()[0];
      return {
         id: Date.now(),  // уникальный идентификатор
         description: '', // описание задачи
         theme: '',       // раздел обучения, уникальная тема
         additional: '',  // дополнительные данные (подсказки)
         type: '',        // должность
         event: event,    // привязанное событие из controller/*
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
    * Подписка на изменение(любое) данных в БД
    * @param {String} field - имя поля на которое смотреть
    * @param {Function} callback - колбек функция которая будет вызываться каждый раз когда происходит изменение данных в БД
    */
   subscribeChanges(field, callback) {
      if (field) {
         const ref = this._db.ref(this._root + field);
         this._subscriber[field] = ref;

         ref.on('value', (res) => callback(res.val()));
      } else {
         throw Error('Нельзя наблюдать за корнем базы!');
      }
   }

   /**
    * Отписка от вотчера
    * @param {String} field
    * @returns {Boolean}
    */
   unsubscribeChanges(field = '') {
      const currentEvents = this._events[field];
      if (currentEvents) {
         this._subscriber[field].off('value');
      }
      return !!currentEvents;
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
    * Создание нескольких задач, принимает на вход массив данных
    * @param {Array<object>} data
    * @returns {Promise<Object|null>}
    */
   createTasks(data) {
      if (data) {
         const createData = {};
         data.forEach((item) => {
            const format = this.getFormatTask();
            const taskData = Object.assign(format, item);
            createData[`task-${taskData.id}`] = taskData;
         });
         return this.massOperations(null, createData);
      } else {
         throw Error('Попытка создать набор задач без данных');
      }
   }

   /**
    * Удалить конкретную задачу
    * @param {String|Number} key
    * @returns {Promise<null>}
    */
   removeTask(key) {
      let taskKey = this.getTaskId(key);
      return this._db.ref(`${this._root}/tasks/${taskKey}`).remove();
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
    * @param {Array|null} keys
    * @param {Object} data данные для массовой вставки
    * @returns {Promise<null>}
    */
   massOperations(keys, data) {
      const updates = {};

      if (!keys) {
         if (!data) {
            throw Error('Недопустимый набор параметров, нужны ключи или данные');
         }
         // если нет ключей - извлечем их из данных
         keys = Object.keys(data);
      }

      // переберем ключи и создадим набор обновляемых данных
      keys.forEach((key) => {
         let keyTask = this.getTaskId(key);
         updates[`${this._root}tasks/${keyTask}`] = data ? data[key] : null;
      });

      return this._db.ref().update(updates);
   }

   /**
    * Возвращает id задачи для вставки
    * @param {String|Number} key
    * @returns {String}
    */
   getTaskId(key) {
      let keyTask = key;
      if (Number.isInteger(+key)) {
         keyTask = `task-${key}`;
      }
      return keyTask;
   }

   /**
    * Сохранить процент прогресса
    * @param {Number} size 
    */
   setProgressSize(size) {
      const userName = this.getUser();
      const data = {
         size,
         dateLastLogin: Date().toString(),
      };
      this.set(`users/${userName}`, data);
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
         user,
      };

      taskId = this.getTaskId(taskId);

      updates[`${this._root}/progress/${user}/${taskId}`] = stateTask;
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
    * Установка пользователя в базу, сохраняет/обновляет дату последнего логина
    * @param {String} userName
    * @returns {Promise<Object|null>}
    */
   setUser(userName = DEFAULT_USER) {
      const data = {
         dateLastLogin: Date().toString(),
      };
      return this.set(`users/${userName}`, data);
   }

   /**
    * Возвращает массив всех пользователей которые когда либо входили в систему
    * @returns {Array<String|null>}
    */
   getAllUsers() {
      return this.get(`users`).then((users) => {
         return users ? Object.keys(users) : null;
      });
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
