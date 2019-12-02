import React, { useCallback } from 'react';
import { Avatar } from 'evergreen-ui'
import { useHistory } from "react-router-dom";

function TopBar({ caption }) {
   const history = useHistory();

   const exitClick = useCallback(
      () => {
         history.replace('/');
         localStorage.setItem('userName', '');
      },
      [history],
   );

   // TODO: убрать классы и вообще вынести TopBar в отдельный компонент
   return (
      <div className="User-TopBar">
         <div className="User-TopBar__headerGroup">
            <div className="User-TopBar__header">Workline</div>
            <div className="User-TopBar__subHeader">{caption}</div>
         </div>
         <div className="User-TopBar__exitGroup" onClick={exitClick}>
            <div className="User-TopBar__text">Выйти</div>
            <Avatar name={localStorage.getItem('userName')} size={40} marginRight={16} />
         </div>
      </div>
   );
}

export default TopBar;
