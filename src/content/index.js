import createProxy from './MessageProxy';
import { POST_MESSAGE_SOURCE } from './Channel';
import {injectScript} from './injectScript'
 
injectScript({
   fileName: '/controller/bundle.js'
});

createProxy({
   portName: 'Workline/content',
   source: POST_MESSAGE_SOURCE
});