import React, {useState, useRef, useEffect} from 'react';
import ContentChannel from './Channel';
import Admin from './Admin/Admin';
import User from './User';
import Home from './Home';
import {
  Switch,
  Route
} from "react-router-dom";
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
         <Switch>
            <Route exact path = '/' component = { Home } /> 
            <Route path = '/user' component = { User } />
            <Route path = '/admin' component = { Admin } />
         </Switch>
        
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
