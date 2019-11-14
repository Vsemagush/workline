import createProxy from './proxyMessage';

/**
 * Каждая вкладка при своём создании получает порт для обмена сообщениями.
 * Фоновая вкладка (эта) собирает все эти порты и прокидывает сообщения между контентными вкладками и страницей опций.
 */
function dependPorts() {
   const ACTIVE_PORTS = new Map();

   function getOnDisconnect(tabId) {
      return () => {
         ACTIVE_PORTS.delete(tabId);
      };
   }

   chrome.runtime.onConnect.addListener((port) => {
      if (!port.name.startsWith('Workline/')) {
         return;
      }
      let tabId;

      if (port.name === 'Workline/options') {
         tabId = 'options';
      } else {
         tabId = String(port.sender.tab.id);
      }

      port.onDisconnect.addListener(getOnDisconnect(tabId));

      if (!ACTIVE_PORTS.has(tabId)) {
         ACTIVE_PORTS.set(tabId, port);
      }

      if (tabId === 'options') {
         if (ACTIVE_PORTS.size > 1) {
            ACTIVE_PORTS.forEach((port, tabId) => {
               if (tabId !== 'proxy') {
                  createProxy(port, ACTIVE_PORTS.get('options'));
               }
            });
         }
      } else if (ACTIVE_PORTS.has('options')) {
         createProxy(port, ACTIVE_PORTS.get('options'));
      }
   });
}

export default dependPorts;
