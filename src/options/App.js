import React, { useState, useRef, useEffect, useCallback } from 'react';
import ContentChannel from './Channel';
import Admin from './Admin/Admin';
import User from './User/LearningPage';
import Home from './Home';
import { Switch, Route, useHistory } from "react-router-dom";
import './App.css';
import DataBaseApi from '../storage/db';

function App() {
   const [lastMessage, setLastMessage] = useState('');
   const [data, setData] = useState('');
   const channel = useRef();
   const db = useRef();

   let history = useHistory();

   // отработает только 1 раз
   useEffect(() => {
      channel.current = new ContentChannel('user-event');
      db.current =  new DataBaseApi();

      return () => {
         channel.current.destroy();
      };
   }, []);

   useEffect(() => {
      const channelRef = channel.current;
      const dbApi = db.current;

      function listener(data) {
         setLastMessage(data);
         dbApi.get('param');
      }

      channelRef.addListener('test-event', listener);
      return () => {
         channelRef.removeListener('test-event', listener);
      };
   });

   /** тестовая функция получения и записи дополнительной задачи - удалить после подключения модули */
   const testClickHandler = useCallback(() => {
      const dbApi = db.current;
      // получаем список всех задачи
      dbApi.get('tasks').then((res) => {
         const testList = Object.keys(res).map((key) => 
            <div key={res[key].id}>
               <div>{res[key].id}</div>
               <div>{res[key].description}</div>
            </div>
         )
         setData(testList);
      });

      // создаем задачу
      const dataObj = {
         description: new Date().toUTCString()
      };

      dbApi.createTask(dataObj);

      // создадим задачу для обновления/удаления
      dataObj.id = 0;
      dbApi.setTask('task-0', dataObj);
      dbApi.setTask('task-1', dataObj);
      dbApi.setTask('task-2', dataObj);
      
      // обновление задачи
      setTimeout(() => {
         dataObj.description = '12345';
         dbApi.updateTask(`task-0`, dataObj);
      }, 500)

      // удаление задач - для отладки
      setTimeout(() => {
         // получим все
         dbApi.get('tasks').then((cur) => {
            console.log(cur);
            // массово удалим задачи созданные ранее
            dbApi.removeTasks(['task-0', 'task-1', 'task-2']).then((rs)=>{
               console.log(rs);
               // проверим удаление
               dbApi.get('tasks').then((res) => {
                  console.log(res);
               })
            });
         })

      }, 1000)
   }, []);

   return (
      <div className="App">
         <Switch>
            <Route exact path='/'> <Home history={ history }/> </Route>
            <Route path='/user'> <User history={ history }/> </Route>
            <Route path='/admin' component = { Admin } />
         </Switch>

         <button className="workline-hidden" onClick={testClickHandler}>Тесты БД (добавляет запись)</button>

         {/* Тесты записи в БД и перехвата событий - удалить перед релизом  */}

         {data && (
            <div className="workline-content">
               {data}
            </div>
         )}


         {/* Тесты записи в БД и перехвата событий - удалить перед релизом  */}

         {data && (
            <div className="workline-content">
               {data}
            </div>
         )}

         {lastMessage && (
            <div className="workline-content">
               <div>Сообщение: {lastMessage.msg}</div>
               <div>Время: {lastMessage.date}</div>
               <div>Список CSS классов: {lastMessage.className}</div>
            </div>
         )}
         {/*************************************************************    */}
      </div>
   );
}

export default App;
