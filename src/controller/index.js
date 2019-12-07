import ContentChannel from './../content/Channel';
import db from './../storage/db';

/**
 * Модуль отвечающий за отслеживание действий на странице.
 * Доступен window страницы на которой запущено расширение.
 * Требования:
 * - Каждая группа событий этапа обучения должна иметь свое уникальное имя
 * - Имя события должно быть уникальным в разрезе этапа
 * - Каждое отслеживаемое действие должно сопровождаться датой выполнения
 * - Каждый этап - выделить по итогу в отдельный файл, сюда импорт
 */

const DataBase = new db();

// пример подписки на событие и передача данных в шину
const channel = new ContentChannel('user-event');

// хак для SPA, вклиниваемся в стандартный процесс записи смены URL в историю
const pushState = history.pushState;
history.pushState = function() {
   pushState.apply(history, arguments);
   const path = arguments[0].href;

   // на главной кто-то записывает историю руками, не запускаем второй раз подписки, если загрузились от туда
   if (path === '/' && window.loaded) {
      window.loaded = false;
      return;
   }

   // куда пришли
   startDetectedEvent(path);
};

// для загрузки страницы, актуально для старых страниц с *.html
window.addEventListener('load', function() {
   const path = window.location.pathname;
   if (path === '/') {
      window.loaded = true;
   }

   // куда пришли
   startDetectedEvent(path);
});

function startDetectedEvent(path) {
   switch (path) {
      case '/':
         // мы на главной странице
         sendNotification('Поздравляем с входом на портал online.sbis.ru!');

         window.addEventListener('click', (event) => {
            const textButton = event.toElement.innerText;
            const elementClass = event.toElement.className;
            const openNews = event.toElement.parentElement;
            const parentFirstLevel = openNews.parentElement;

            if (textButton === 'Все сотрудники') {
               preparation('Вы открыли список сотрудников! Тут можно найти ваших коллег!', 'news_click-all-staff');
            }

            if (elementClass.includes('n-EmojiLikeHover')) {
               preparation('Вы сняли лайк. Ещё не поздно передумать)', 'news_unlike-click');
            } else if (elementClass.includes('n-EmojiLike')) {
               preparation('Вы оценили новость! Так держать!', 'news_like-click');
            }

            if ((openNews.className === 'feed-Item' ||
               openNews.className === 'feed-Content' ||
               (parentFirstLevel.parentElement !== null && parentFirstLevel.parentElement.parentElement !== null &&
                  parentFirstLevel.parentElement.parentElement.className === 'feed-Content'))) {
               preparation('Вы открыли новость! Замечательно!', 'news_post-open');
            }
            if (openNews.parentElement.className.includes('controls-ListView__item__selected') ||
               parentFirstLevel.parentElement.className.includes('controls-ListView__item__selected')) {
               preparation('Вы получили список новостей по выбранной группе!', 'news_post-filter');
            }

            if (elementClass.includes('noticeCenter-Panel__closeButton_shading') ||
               openNews.className.includes('noticeCenter-Panel__closeButton_shading')) {
               preparation('Вы скрыли панель уведомлений. Они будут скучать', 'news_notification-hidden');
            } else if (openNews.className === 'noticeCenter-EmbedButton' || openNews.className === 'noticeCenter-Button') {
               preparation('Вы открыли панель уведомлений. Здесь много важных событий', 'news_notification-open');
            }

         });
         break;
      case '/contacts/':
         // мы в контактах
         sendNotification('Тут находятся все твои сообщения!');
         window.addEventListener('click', (event) => {
            const isSendButton = event.toElement.classList.contains('icon-Send');
            if (isSendButton) {
               preparation('Вы отправили свое первое сообщение!', 'contacts_click-new-message');
            }
         });
         break;
      case '/Tasks/registry/OnMe/':
         // мы в задачах
         sendNotification('Тут будут твои задачи!');
         window.addEventListener('click', (event) => {
            const textButton = event.toElement.innerText;
            if (textButton === 'Задача') {
               preparation('Вы открыли свою первую задачу, заполните поля и продолжите работу!', 'tasks_click-new-task');
            }
         });
         break;
      case '/disk.html':
         // мы в Документах
         sendNotification('Документацию искать тут!');
         break;
      case '/employees.html':
         // мы в Сотрудниках
         sendNotification('Коллег и других сотрудников можно найти здесь!');
         break;
      case '/Calendar/':
         //мы в календаре
         sendNotification('Здесь Вы можете заполнить своё расписание!');
         window.addEventListener('click', (event) => {
            const arrayList = event.toElement.className;
            if (arrayList.includes('icon-Yes')) {
               preparation('Вы создали событие в Вашем расписании, можете продолжить работу!', 'calendar_click-new-event');
            }
         });
         break;
   }
}

/**
 * Показ уведомления справа снизу
 * @param {String} msg
 * @param {*} template
 */
function sendNotification(msg, template) {
   // задержка между показом и переходом - потом оставить только для событий перехода
   setTimeout(function() {
      if (!template) {
         template = 'Controls/popupTemplate:NotificationSimple'; // с иконками
         // template = 'Controls/popupTemplate:Notification' // просто 
      }
      window.require(['Controls/popup'], (popup) => {
         popup.Notification.openPopup({
            template: template,
            autoClose: true,
            templateOptions: {
               bodyContentTemplate: msg,
               style: 'success',
               text: msg,
               icon: 'Admin',
            },
         });
      });
   }, 1000);
}

/**
 * Показ окна подтверждения
 * @param {String} msg
 */
function sendConfirmation(msg) {
   window.require(['Controls/popup'], (popup) => {
      popup.Confirmation.openPopup({
         message: msg,
         yesCaption: 'Ок',
         type: 'ok',
         templateOptions: {
            style: 'danger',
         },
      });
   });
}

/**
 * Cоздаю окошко с сообщением, отправляю событие
 * @param {String} msg - текст который будет показан в окошке
 * @param {Date} date - дата, необязательный аттрибут. По умолчанию new Date()
 * @param {String} eventName - название событие которое должно запускать действие
 */
function preparation(msg, eventName, date = new Date()) {
   // получаю список состояний задач
   DataBase.getState().then((res) => {
      // рассматриваю отдельно каждое состояние
      DataBase.toArray(res).forEach((task) => {
         if (task !== undefined) {
            // Получаю данные по таску
            DataBase.subscribeChanges('tasks', function(data) {
               // Задание связано с нашим событием
               if (data[task.id].event === eventName) {
                  // И оно выполнено
                  if (task.state === 'done') {
                     return;
                  }
                  // Если не выполнено отправляю event и показываю окошко с текстом
                  channel.dispatch(eventName, { msg, date });
                  // временно, перейти на определение открытия панели
                  setTimeout(() => sendConfirmation(msg), 1000);
               }
            });
         }
      });
   });
}