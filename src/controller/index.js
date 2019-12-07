import ContentChannel from './../content/Channel';

/**
 * Модуль отвечающий за отслеживание действий на странице.
 * Доступен window страницы на которой запущено расширение.
 * Требования:
 * - Каждая группа событий этапа обучения должна иметь свое уникальное имя
 * - Имя события должно быть уникальным в разрезе этапа
 * - Каждое отслеживаемое действие должно сопровождаться датой выполнения
 * - Каждый этап - выделить по итогу в отдельный файл, сюда импорт
 */

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
               parentFirstLevel.parentElement.className.includes('controls-ListView__item__selected')) {
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
      case '/disk.html':
         // мы в Документах
         sendNotification('Документацию искать тут!');
         break;
      case '/employees.html':
         // мы в Сотрудниках
         sendNotification('Коллег и других сотрудников можно найти здесь!');
         let timerId = setInterval(() => {
            const cearhelement = document.getElementsByClassName('controls-InputRender__wrapper_singleLine');
            if ( cearhelement[0]){
               clearInterval(timerId);
               cearhelement[0].addEventListener('click', (event) => {
                  let stopId = setInterval(() => {
                     const isSearchButton = document.getElementsByClassName('controls-InputRender__field');
                     if (isSearchButton[0].value !== '') {
                        clearInterval(timerId);
                        clearInterval(stopId);
                        const msg = 'Вы начали свой первый поиск сотрудника!';
                        const date = new Date();

                        channel.dispatch('news_click-all-staff',{ msg, date });

                        // временно, перейти на определение открытия панели
                        setTimeout(() => sendConfirmation(msg), 1000);
                     }
                  },100)

               });
            }
   },100);

         // setTimeout(() => { clearInterval(timerId); alert(''); }, 5000);
         // if (timerId) {

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
