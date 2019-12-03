import React, { useRef, useCallback } from 'react';

/** Главная страница - страница авторизации */
function Home({ history }) {
    const EDIT_DEFAULT_LOGIN = 'admin';
    const EDIT_DEFAULT_PASSWORD = '123';

    const loginInput = useRef();
    const passInput = useRef();

    /** Обработчик нажатия на "Войти" */
    const onEnterClick = useCallback(
        () => {
            let data = {
                login: loginInput.current && loginInput.current.value,
                password: passInput.current && passInput.current.value
            };
            if (data.login === EDIT_DEFAULT_LOGIN &&
                data.password === EDIT_DEFAULT_PASSWORD) {
                history.replace('/admin');
            } else {
                localStorage.setItem('userName', data.login);
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