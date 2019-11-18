import React, {useState, useRef, useEffect} from 'react';
import ContentChannel from './Channel';
import Admin from './Admin';
import User from './User';
import Home from './Home';
import {
  BrowserRouter as Router,
  Route,
  Link
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
        <Router>
            <div>
               <div>
                  <Route path="/options" component={Home}/>
                  <Route path="/user" component={User} />
                  <Route path="/admin" component={Admin} />
               </div>
               <div className="menu">
                  <Link to="/user">Обучение</Link>
                  <Link to="/admin">Редактирование</Link>
               </div>
            </div>
        </Router>
        
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
