import React, {useState, useRef, useEffect} from 'react';
import ContentChannel from './Channel';
import './App.css';

function App() {
   const [lastMessage, setLastMessage] = useState('');
   const ref = useRef();
   useEffect(() => {
      ref.channel = new ContentChannel('Stage-0');
      return () => {
         ref.channel.destroy();
      }
   }, []);

   useEffect(() => {
      function listener(data) {
         setLastMessage(data);
      }
      ref.channel.addListener('test-event', listener);
      return () => {
         ref.channel.removeListener('test-event', listener);
      };
   });

   return (
      <div className="App">
         <h1>Workline home page</h1>
         {lastMessage &&
            <div className="workline-content">
               <div>Сообщение: {lastMessage.msg}</div>
               <div>Время: {lastMessage.date}</div>
               <div>Список CSS классов: {lastMessage.className}</div>
            </div>
         }
      </div>
   );
}

export default App;
