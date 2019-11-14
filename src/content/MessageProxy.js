const getPort = (() => {
   let port;
   return function(name) {
      if (port) {
         return port;
      }
      port = chrome.runtime.connect({
         name
      });

      port.onDisconnect.addListener(() => {
         port = undefined;
      });
      return port;
   };
})();

function getProxyToPage(source) {
   return function(data) {
      window.postMessage(
         {
            data,
            source,
            __proxyMessage__: true
         },
         '*'
      );
   };
}

function getProxyToPort(port, proxySource) {
   return (event) => {
      if (event.source !== window || !event.data) {
         return;
      }
      const { source, data, __proxyMessage__ } = event.data;

      if (source !== proxySource || __proxyMessage__) {
         return;
      }
      port.postMessage(data);
   };
}

function createProxy({ portName, source }) {
   let port = getPort(portName);

   let proxyToPort = getProxyToPort(port, source);
   let proxyToPage = getProxyToPage(source);

   port.onMessage.addListener(proxyToPage);
   port.onDisconnect.addListener(() => {
      window.removeEventListener('message', proxyToPort);
   });

   window.addEventListener('message', proxyToPort, false);
}

export default createProxy;
