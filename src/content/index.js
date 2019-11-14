import createProxy from './MessageProxy';
import { POST_MESSAGE_SOURCE } from './Channel';

createProxy({
   portName: 'Workline/content',
   source: POST_MESSAGE_SOURCE
});
