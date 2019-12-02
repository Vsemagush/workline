const port = chrome.runtime.connect({
   name: 'Workline/options'
});

/**
 * Позволяет отправлять сообщения из расширения на страницу.
 */
class OptionsChannel {
   /**
    * @param {String} name Имя канала, в который будет отправлено сообщение.
    */
   constructor(name) {
      this._name = name;
      this._listeners = new Map();
      this._onmessageHandler = this._onmessage.bind(this);
      port.onMessage.addListener(this._onmessageHandler);
   }

   /**
    * Отправляет сообщение.
    * @param {String} event Название события.
    * @param args Аргументы события, которые придут в обработчик. Принимает любое сериализуемое значение.
    */
   dispatch(event, args) {
      port.postMessage({
         source: this._name,
         args,
         event
      });
      return true;
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
      port.onMessage.removeListener(this._onmessageHandler);
   }

   _onmessage({ source, args, event }) {
      if (source !== this._name) {
         return;
      }
      const listeners = this._listeners.get(event);

      if (!listeners) {
         return false;
      }

      listeners.forEach((callback) => {
         callback.call(this, args);
      });
   }
}

export default OptionsChannel;
