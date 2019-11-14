const port = chrome.runtime.connect({
   name: 'Workline/options'
});

class OptionsChannel {
   constructor(name) {
      this._name = name;
      this._listeners = new Map();
      this._onmessageHandler = this._onmessage.bind(this);
      port.onMessage.addListener(this._onmessageHandler);
   }

   dispatch(event, args) {
      port.postMessage({
         source: this._name,
         args,
         event
      });
      return true;
   }

   addListener(event, callback) {
      let listeners = this._listeners.get(event);
      if (!listeners) {
         listeners = new Set();
         this._listeners.set(event, listeners);
      }
      listeners.add(callback);
      return this;
   }

   removeListener(event, callback) {
      const listeners = this._listeners.get(event);
      if (listeners) {
         listeners.delete(callback);
      }
      return this;
   }

   removeAllListeners(event) {
      if (!event) {
         this._listeners.clear();
         return this;
      }
      this._listeners.delete(event);
      return this;
   }

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
