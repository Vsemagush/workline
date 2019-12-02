const TAB_ID = Math.random()
   .toString()
   .substr(2);

export const POST_MESSAGE_SOURCE = 'Workline/content-message';

/**
 * Позволяет отправлять сообщения со страницы в расширение.
 */
class ContentChannel {
   /**
    * @param {String} name Имя канала, в который будет отправлено сообщение.
    */
   constructor(name) {
      this._name = name;
      this._listeners = new Map();
      this._onmessageHandler = this._onmessage.bind(this);
      window.addEventListener('message', this._onmessageHandler);
   }

   /**
    * Отправляет сообщение.
    * @param {String} event Название события.
    * @param args Аргументы события, которые придут в обработчик. Принимает любое сериализуемое значение.
    */
   dispatch(event, args) {
      window.postMessage(
         {
            source: POST_MESSAGE_SOURCE,
            data: {
               source: this._name,
               args,
               event
            },
            __tabId__: TAB_ID
         },
         '*'
      );
   }

   /**
    * Регистрирует обработчик события.
    * @param {String} event Название события.
    * @param {Function} callback Обработчик события.
    * @returns {ContentChannel}
    */
   addListener(event, callback) {
      let listeners = this._listeners.get(event);
      if (!listeners) {
         listeners = new Set();
         this._listeners.set(event, listeners);
      }
      listeners.add(callback);
      return this;
   }

   /**
    * Удаляет обработчик события.
    * @param {String} event Название события.
    * @param {Function} callback Обработчик события.
    * @returns {ContentChannel}
    */
   removeListener(event, callback) {
      const listeners = this._listeners.get(event);
      if (listeners) {
         listeners.delete(callback);
      }
      return this;
   }

   /**
    * Удаляет все обработчики события.
    * @param {String} event Название события
    * @returns {ContentChannel}
    */
   removeAllListeners(event) {
      if (!event) {
         this._listeners.clear();
         return this;
      }
      this._listeners.delete(event);
      return this;
   }

   /**
    * Нужно звать при разрушении канала, чтобы он не слушал события.
    */
   destructor() {
      window.removeEventListener('message', this._onmessageHandler);
      this._listeners.clear();
   }

   _onmessage(event) {
      if (!event.data) {
         return;
      }
      const { source, data, __tabId__ } = event.data;
      // Отсеиваем чужие сообщения и сообщения от самих себя
      if (source !== POST_MESSAGE_SOURCE || __tabId__ === TAB_ID) {
         return;
      }
      if (data.source !== this._name) {
         return;
      }
      const listeners = this._listeners.get(event);

      if (!listeners) {
         return false;
      }

      listeners.forEach((callback) => {
         callback.call(this, data.args);
      });
   }
}

export default ContentChannel;
