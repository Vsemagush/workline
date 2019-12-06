import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import Admin from './Admin/Admin';
import LearningPage from './User/LearningPage';

function App() {
   return (
      <Switch>
         <Route exact path="/" component={Home}/>
         <Route path="/admin" component={Admin}/>
         <Route path="/user" component={LearningPage}/>
      </Switch>
   );
}

export default App;
