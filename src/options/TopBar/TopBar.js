import React, { useCallback } from 'react';
import { Avatar } from 'evergreen-ui';
import { useHistory } from 'react-router-dom';
import './TopBar.css';

function TopBar({ caption }) {
   const history = useHistory();

   const exitClick = useCallback(() => {
      history.replace('/');
      localStorage.setItem('userName', '');
   }, [history]);

   return (
      <div className="TopBar">
         <div className="TopBar__headerGroup">
            <div className="TopBar__header">Workline</div>
            <div className="TopBar__logoBlock">
               <img className="TopBar__logo" src="../../assets/logo.png"></img>
            </div>
            <div className="TopBar__subHeader">{caption}</div>
         </div>
         <div className="TopBar__exitGroup" onClick={exitClick}>
            <img className="TopBar__logout" src="../../assets/logout.png"></img>
            <Avatar
               name={localStorage.getItem('userName')}
               size={40}
               marginRight={16}
            />
         </div>
      </div>
   );
}

export default TopBar;
