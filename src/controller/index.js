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
         sendNotification('Поздравляем с входом на портал online.sbis.ru!')

         window.addEventListener('click', (event) => {
            const textButton = event.toElement.innerText;
            if (textButton === 'Все сотрудники') {
               const msg = 'Вы открыли список сотрудников! Тут можно найти ваших коллег!';
               const date = new Date();

               channel.dispatch('news_click-all-staff', { msg, date });
               
               // временно, перейти на определение открытия панели
               setTimeout(() => sendConfirmation(msg), 1000);
            }
         });
         break;
      case '/contacts/':
         // мы в контактах
         sendNotification('Тут находятся все твои сообщения!')
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
         sendNotification('Тут будут твои задачи!')
         window.addEventListener('click', (event) => {
            const textButton = event.toElement.innerText;
            if (textButton === 'Задача') {
               const msg = 'Вы открыли свою первую задачу, заполните поля и продолжите работу!';
               const date = new Date();

               channel.dispatch('tasks_click-new-task', { msg, date });
               
               // временно, перейти на определение открытия панели
               setTimeout(() => sendConfirmation(msg), 1000)
            }
         });
         break;
      case '/disk.html':
         // мы в Документах
         sendNotification('Документацию искать тут!')
         break;
      case '/employees.html':
         // мы в Сотрудниках
         sendNotification('Коллег и других сотрудников можно найти здесь!')
         break;
      case '/Calendar/':
         //мы в календаре
         sendNotification('Здесь Вы можете заполнить своё расписание!')
         window.addEventListener('click', (event) => {
            const arrayList = event.toElement.className;
            if (arrayList.includes('icon-Yes')) {
               const msg = 'Вы создали событие, продолжайте работу!';
               const date = new Date();

               channel.dispatch('kalendar_click-new-evil', { msg, date });
               
               // временно, перейти на определение открытия панели
               setTimeout(() => sendConfirmation(msg), 1000)
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
   setTimeout(function(){
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
            style: "danger"
         },
      })
   })
}
