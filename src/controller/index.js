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
const channel = new ContentChannel('Stage-0');
window.addEventListener('click', (event) => {
   const msg = 'detected click';
   const date = new Date(); // потребуется в последствии для фиксирования времени исполнения
   const className = event.toElement.className;
   channel.dispatch('test-event', { msg, date, className });

   window.require(['Controls/popup'], (popup) => {
      popup.Notification.openPopup({
         template: 'Controls/popupTemplate:NotificationSimple',
         autoClose: true,
         templateOptions: { 
            style: 'success', 
            text: 'Успешный клик!', 
            icon: 'Admin' 
         },
      });
   });
});
