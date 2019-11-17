/**
 * Установка в зависимости страницы произвольного скрипта
 * @param {String} fileName - путь до бандла, например '/controller/bundle.js'
 */
const injectScript = ({
   fileName
}) => {
   const scriptElement = document.createElement('script');
   scriptElement.setAttribute('type', 'text/javascript');
   if (fileName) {
      scriptElement.src = chrome.extension.getURL(fileName);
   }
   document.documentElement.appendChild(scriptElement);
   if (scriptElement.parentNode) {
      scriptElement.parentNode.removeChild(scriptElement);
   }
};

export { injectScript };