import React, { useRef } from 'react';
import { useHistory } from "react-router-dom";

/** Главная страница - страница авторизации */
function Home() {
    const EDIT_DEFAULT_LOGIN = 'admin';
    const EDIT_DEFAULT_PASSWORD = 'admin123';

    const loginInput = useRef();
    const passInput = useRef();
    let history = useHistory();

    /** Обработчик нажатия на "Войти" */
    function onEnterClick() {
        let data = {
            login: loginInput.current && loginInput.current.value,
            password: passInput.current && passInput.current.value
        };
        if (data.login === EDIT_DEFAULT_LOGIN &&
            data.password === EDIT_DEFAULT_PASSWORD) {
            history.replace('/admin');
        } else {
            history.replace('/user');
        }
    }

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