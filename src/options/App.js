import React from 'react';
import Admin from './Admin/Admin';
import User from './User/LearningPage';
import Home from './Home';
import { Switch, Route } from "react-router-dom";
import './App.css';

function App() {
   return (
      <div className="App">
         <Switch>
            <Route exact path='/' component = { Home } />
            <Route path='/user' component = { User } />
            <Route path='/admin' component = { Admin } />
         </Switch>
      </div>
   );
}

export default App;
