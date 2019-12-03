import React, { useCallback } from 'react';
import { Avatar } from 'evergreen-ui'
import { useHistory } from "react-router-dom";

function TopBar() {
    const history = useHistory();

    /** Обработчик нажатия на "Выйти" */
    const exitClick = useCallback(
        () => {
            history.replace('/');
            localStorage.setItem('userName', '');
        }, 
        [history],
    );

    return (
        <div className="User-TopBar">
            <div className="User-TopBar__headerGroup">
                <div className="User-TopBar__header">Workline</div>
                <div className="User-TopBar__subHeader">Обучение</div>
            </div>
            <div className="User-TopBar__exitGroup" onClick={exitClick}>
                <div className="User-TopBar__text">Выйти</div>
                <Avatar name={localStorage.getItem('userName')} size={40} marginRight={16} />
            </div>
        </div>
    );
}

export default TopBar;
