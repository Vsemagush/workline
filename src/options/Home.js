import React, { useRef, useCallback, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import DataBaseApi from '../storage/db';

/** Главная страница - страница авторизации */
function Home() {
    const EDIT_DEFAULT_LOGIN = 'admin';
    const EDIT_DEFAULT_PASSWORD = '123';

    const loginInput = useRef();
    const passInput = useRef();

    const history = useHistory();

    const db = useRef();
    useEffect(() => {
       db.current = new DataBaseApi();
    });

    /** Обработчик нажатия на "Войти" */
    const onEnterClick = useCallback(
        () => {
            let data = {
                login: loginInput.current && loginInput.current.value,
                password: passInput.current && passInput.current.value
            };

            // сохраним пользователя в браузер + базу
            localStorage.setItem('userName', data.login);
            db.current.setUser(data.login);

            if (data.login === EDIT_DEFAULT_LOGIN &&
                data.password === EDIT_DEFAULT_PASSWORD) {
                history.replace('/admin');
            } else {
                history.replace('/user');
            }
        }, 
        [history, loginInput, passInput],
    );

    return (
        <div>
            <h1 className="header">Workline</h1>
            <div className="form">             
                <input type="text" ref={loginInput} placeholder="Логин" className="form-input" />
                <input type="password" ref={passInput} placeholder="Пароль" className="form-input" />
                <button className="btn-enter" onClick={onEnterClick}>Войти</button>
            </div>
        </div>
    );
}

export default Home;