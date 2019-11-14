function getMessageProxy(port) {
   return function(message) {
      port.postMessage(message);
   };
}

function getOnDisconnect(dependentPort, messageProxy) {
   return function() {
      dependentPort.onMessage.removeListener(messageProxy);
   };
}

function createProxy(port1, port2) {
   const proxyTo1 = getMessageProxy(port1);
   const proxyTo2 = getMessageProxy(port2);

   const onDisconnect1 = getOnDisconnect(port2, proxyTo1);
   const onDisconnect2 = getOnDisconnect(port1, proxyTo2);

   port1.onMessage.addListener(proxyTo2);
   port2.onMessage.addListener(proxyTo1);

   port1.onDisconnect.addListener(onDisconnect1);
   port2.onDisconnect.addListener(onDisconnect2);
}

export default createProxy;
