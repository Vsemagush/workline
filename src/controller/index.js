import ContentChannel from './../content/Channel';
import css from './../controller/style.css';

/**
 * Модуль отвечающий за отслеживание действий на странице.
 * Доступен window страницы на которой запущено расширение.
 * Требования:
 * - Каждая группа событий этапа обучения должна иметь свое уникальное имя
 * - Имя события должно быть уникальным в разрезе этапа
 * - Каждое отслеживаемое действие должно сопровождаться датой выполнения
 * - Каждый этап - выделить по итогу в отдельный файл, сюда импорт
 */

//chrome.tabs.insertCSS();

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
const pageWidth = document.getElementsByClassName('ws-flexbox ws-flex-grow-1 onlinePage_Base_blockWrapper');
const spanSecond = document.createElement('div');
spanSecond.style.id = 'arrow-div';
spanSecond.style.textDecoration = 'none';
spanSecond.style.fontSize = '40px';
spanSecond.style.position = 'absolute';
spanSecond.style.left = (pageWidth[0].offsetWidth - 55).toString() + 'px';
spanSecond.innerHTML = '↗';
spanSecond.style.top = '15px';
spanSecond.style.zIndex = '10';

const span = document.createElement('span');
span.style.textDecoration = 'none';
span.style.fontSize = '40px';
span.style.position = 'absolute';
span.style.right = '15px';
span.innerHTML = '↑';
span.style.top = '15px';
span.style.zIndex = '10';

const tasksspan = document.createElement('span');
tasksspan.style.textDecoration = 'none';
tasksspan.style.fontSize = '40px';
tasksspan.style.position = 'absolute';
tasksspan.style.left = '30px';
tasksspan.innerHTML = '↑';
tasksspan.style.top = '15px';
tasksspan.style.zIndex = '10';

const constactsspan = document.createElement('span');
constactsspan.style.textDecoration = 'none';
constactsspan.style.fontSize = '40px';
constactsspan.style.position = 'absolute';
constactsspan.style.left = '30px';
constactsspan.innerHTML = '↑';
constactsspan.style.top = '15px';
constactsspan.style.zIndex = '10';

const taskFromMe = document.createElement('span');
taskFromMe.id = 'taskFromMe';
taskFromMe.style.textDecoration = 'none';
taskFromMe.style.fontSize = '50px';
taskFromMe.style.position = 'absolute';
taskFromMe.style.left = (Math.trunc(pageWidth[0].offsetWidth / 2)).toString() + 'px';
taskFromMe.innerHTML = '↓';
taskFromMe.style.top = '60px';
taskFromMe.style.zIndex = '10';

function clearLayout() {
   if (document.body.contains(spanSecond) || document.body.contains(span) || document.body.contains(taskFromMe)
      || document.body.contains(constactsspan) || document.body.contains(tasksspan)) {
      location.reload();
   }
}

function setLayout() {
   setTimeout(function() {
      const overlay = document.createElement('div');
      overlay.id = 'overlay';
      overlay.style.zIndex = '1';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'lightblue';
      overlay.style.position = 'absolute';
      overlay.style.clip = 'rect(3em, auto, auto, auto)';
      overlay.style.opacity = '0.5';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.overflow = 'auto';


      //document.body.appendChild(overlay);
      const notificationDisable = document.getElementsByClassName('noticeCenter-Button noticeCenter-Button_expand noticeCenter-Panel__closeButton ws-flex-shrink-0 noticeCenter-Panel__closeButton_shading');
      if (notificationDisable.length !== 0) {
         notificationDisable[0].style.border = '2px solid';
         notificationDisable[0].style.borderColor = 'lightblue';
         notificationDisable[0].style.borderRadius = '10px';
         notificationDisable[0].style.boxShadow = ' inset 0 0 30px lightblue ';
         notificationDisable[0].appendChild(span);
      } else {
         const notificationEnable = document.getElementsByClassName('noticeCenter-Button');
         if (notificationEnable.length !== 0) {
            notificationEnable[0].style.border = '3px solid';
            notificationEnable[0].style.borderColor = 'lightblue';
            notificationEnable[0].style.borderRadius = '10px';
            notificationEnable[0].style.boxShadow = ' inset 0 0 30px lightblue ';
            document.body.appendChild(spanSecond);
         }
      }
   }, 2000);

}

function setContactsLayout() {
   setTimeout(function() {
      const newMessage = document.getElementsByClassName('controls-BaseButton controls-Button_button controls-Button_button_theme-online-default controls-Button_clickable controls-Button_button_style-primary_theme-online-default controls-Button_bg-same_theme-online-default controls-inlineheight-m_theme-online-default controls-Button-inlineheight-m_theme-online-default controls-Button_button_m_theme-online-default msg-workspace-layout__top-area-content');
      if (newMessage.length !== 0) {
         newMessage[0].style.border = '3px solid';
         newMessage[0].style.borderColor = 'lightblue';
         newMessage[0].style.borderRadius = '10px';
         newMessage[0].style.boxShadow = ' inset 0 0 30px lightblue ';
         newMessage[0].appendChild(constactsspan);
      }
   }, 2000);
}

function setMineTasksLayout() {
   setTimeout(function() {
      const mineTask = document.getElementsByClassName('controls-Grid__row controls-ListView__itemV controls-ListView__itemV_cursor-pointer controls-Grid__row_highlightOnHover_default_theme-online-default controls-Grid__row_default_theme-online-default');
      if (mineTask.length !== 0) {
         mineTask[0].style.border = '3px solid';
         mineTask[0].style.borderColor = 'lightblue';
         mineTask[0].style.borderRadius = '10px';
         mineTask[0].style.boxShadow = ' inset 0 0 30px lightblue ';
         document.body.appendChild(taskFromMe);
      }
   }, 2000);
}

function setTasksLayout() {
   setTimeout(function() {

      const newMessage = document.getElementsByClassName('controls-BaseButton__wrapper controls-fontsize-m_theme-online-default controls-Button_button__wrapper-fontsize-m_theme-online-default controls-Button__wrapper_viewMode-button controls-Button__wrapper_button_m_theme-online-default');
      if (newMessage.length !== 0) {
         newMessage[0].style.border = '3px solid';
         newMessage[0].style.borderColor = 'lightblue';
         newMessage[0].style.borderRadius = '10px';
         newMessage[0].style.boxShadow = ' inset 0 0 30px lightblue ';
         newMessage[0].appendChild(tasksspan);
      }
   }, 2000);
}


function startDetectedEvent(path) {
   switch (path) {
      case '/':
         //clearLayout();
         //@TODO Жду информации о формате запуска подсказки.
         //setLayout();
         // мы на главной странице
         sendNotification('Поздравляем с входом на портал online.sbis.ru!');

         window.addEventListener('click', (event) => {
            const textButton = event.toElement.innerText;
            const elementClass = event.toElement.className;
            const openNews = event.toElement.parentElement;
            const parentFirstLevel = openNews.parentElement;

            if (textButton === 'Все сотрудники') {
               const msg = 'Вы открыли список сотрудников! Тут можно найти ваших коллег!';
               const date = new Date();

               channel.dispatch('news_click-all-staff', { msg, date });

               // временно, перейти на определение открытия панели
               setTimeout(() => sendConfirmation(msg), 1000);
            }
            if (elementClass.includes('n-EmojiLike')) {
               const msg = 'Вы оценили новость! Так держать!';
               const date = new Date();

               channel.dispatch('news_like-click', { msg, date });

               // временно, перейти на определение открытия панели
               setTimeout(() => sendConfirmation(msg), 1000);
            }
            if (elementClass.includes('n-EmojiLikeHover')) {
               const msg = 'Вы сняли лайк. Ещё не поздно передумать)';
               const date = new Date();

               channel.dispatch('news_unlike-click', { msg, date });

               // временно, перейти на определение открытия панели
               setTimeout(() => sendConfirmation(msg), 1000);
            }
            if ((openNews.className === 'feed-Item' ||
               openNews.className === 'feed-Content' ||
               (parentFirstLevel.parentElement !== null && parentFirstLevel.parentElement.parentElement !== null &&
                  parentFirstLevel.parentElement.parentElement.className === 'feed-Content'))) {
               const msg = 'Вы открыли новость! Замечательно!';
               const date = new Date();

               channel.dispatch('news_post-open', { msg, date });

               // временно, перейти на определение открытия панели
               setTimeout(() => sendConfirmation(msg), 1000);
            }
            if (openNews.parentElement.className.includes('controls-ListView__item__selected') ||
               (parentFirstLevel != null && parentFirstLevel.parentElement != null &&
                  parentFirstLevel.parentElement.className.includes('controls-ListView__item__selected'))) {
               const msg = 'Вы получили список новостей по выбранной группе!';
               const date = new Date();

               channel.dispatch('news_post-filter', { msg, date });
               // временно, перейти на определение открытия панели
               setTimeout(() => sendConfirmation(msg), 1000);
            }
            if (elementClass.includes('noticeCenter-Panel__closeButton_shading') ||
               openNews.className.includes('noticeCenter-Panel__closeButton_shading')) {
               const msg = 'Вы скрыли панель уведомлений. Они будут скучать';
               const date = new Date();

               channel.dispatch('news_notification-hidden', { msg, date });
               // временно, перейти на определение открытия панели
               setTimeout(() => sendConfirmation(msg), 1000);
            } else if (openNews.className === 'noticeCenter-EmbedButton' || openNews.className === 'noticeCenter-Button') {
               const msg = 'Вы открыли панель уведомлений. Здесь много важных событий';
               const date = new Date();

               channel.dispatch('news_notification-open', { msg, date });
               // временно, перейти на определение открытия панели
               setTimeout(() => sendConfirmation(msg), 1000);
            }

         });
         break;
      case '/contacts/':

         // мы в контактах
         //@TODO Жду информации о формате запуска подсказки.
         //clearLayout();
         //setContactsLayout();
         sendNotification('Тут находятся все твои сообщения!');
         window.addEventListener('click', (event) => {
            const isSendButton = event.toElement.classList.contains('icon-Send');
            if (isSendButton) {
               const msg = 'Вы отправили свое первое сообщение!';
               const date = new Date();

               channel.dispatch('contacts_click-new-message', { msg, date });

               // временно, перейти на определение открытия панели
               setTimeout(() => sendConfirmation(msg), 1000);
            }
         });
         break;
      case '/Tasks/registry/OnMe/':
         // мы в задачах
         //@TODO Жду информации о формате запуска подсказки.
         //clearLayout();
         //setTasksLayout();
         sendNotification('Тут будут твои задачи!');
         window.addEventListener('click', (event) => {
            const textButton = event.toElement.innerText;
            if (textButton === 'Задача') {
               const msg = 'Вы открыли свою первую задачу, заполните поля и продолжите работу!';
               const date = new Date();

               channel.dispatch('tasks_click-new-task', { msg, date });

               // временно, перейти на определение открытия панели
               setTimeout(() => sendConfirmation(msg), 1000);
            }
         });
         break;
      case '/Tasks/registry/FromMe/':
         //@TODO Жду информации о формате запуска подсказки.
         //clearLayout();
         //setMineTasksLayout();
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
               const msg = 'Вы создали событие в Вашем расписании, можете продолжить работу!';
               const date = new Date();

               channel.dispatch('calendar_click-new-event', { msg, date });

               // временно, перейти на определение открытия панели
               setTimeout(() => sendConfirmation(msg), 1000);
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
