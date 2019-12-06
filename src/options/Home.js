import React, { useCallback, useRef } from 'react';
import { TextInput } from 'evergreen-ui';
import { Button } from 'evergreen-ui';
import { useHistory } from "react-router-dom";

/** Главная страница - страница авторизации */
function Home() {
    const EDIT_DEFAULT_LOGIN = 'admin';
    const EDIT_DEFAULT_PASSWORD = '123';
    const history = useHistory();
    const login = useRef();
    const password = useRef();

    /** Обработчик нажатия на "Войти" */
    const onEnterClick = useCallback(() => {
        const loginInput = login.current && login.current.value;
        const passwordInput = password.current && password.current.value;
        if (loginInput === EDIT_DEFAULT_LOGIN && passwordInput === EDIT_DEFAULT_PASSWORD){
            history.replace('/admin');
        }
        else {
            history.replace('/user');
        }
    }, [history,password,login]);

    return (
        <div>
            <div className="TopBar__header">Workline</div>
            <div className="TopBar__logoBlock">
               <img className="TopBar__logo" src="../../assets/logo.png"></img>
            </div>
            <div className = "TextBar"><TextInput
                innerRef={login}
                placeholder="Логин"
                className=""
            />
            </div>
            <div className = "TextBar"><TextInput
                innerRef = {password}
                placeholder="Пароль"
            />
            </div>
            <div className = "TextBar"><Button 
                //arginRight={12} 
                height={40} 
                onClick={onEnterClick}
               >
                Войти
            </Button>
            </div>
        </div>
    );
}

export default Home;