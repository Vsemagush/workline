import React, { useCallback, useRef } from 'react';
import { TextInput, Button } from 'evergreen-ui';
import { useHistory } from 'react-router-dom';
import ParticleComponent from './ParticleComponent';

/** Главная страница - страница авторизации */
function Home() {
   const EDIT_DEFAULT_LOGIN = 'admin';
   const EDIT_DEFAULT_PASSWORD = '123';
   const history = useHistory();
   const login = useRef();
   const password = useRef();

   /** Обработчик нажатия на "Войти" */
   const onEnterClick = useCallback(() => {
      const loginInput = login.current.value;
      const passwordInput = password.current.value;
      localStorage.setItem('userName', loginInput);
      if (loginInput === EDIT_DEFAULT_LOGIN && passwordInput === EDIT_DEFAULT_PASSWORD) {
         history.replace('/admin');
      } else {
         history.replace('/user');
      }
   }, [history, password, login]);

   return (
      <div
         style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
         }}
      >
         <ParticleComponent/>
         <div
            style={{
               position: 'absolute',
               top: 0,
               left: 0,
               width: '100%',
               height: '100%',
            }}>
            <div className="Home-Form">
               <div>
                <span className="TopBar__logoBlock">
                    <img className="TopBar__logo" src="../../assets/logo.png"></img>
                </span>
                  <span className="TopBar__header">Workline</span>
               </div>
               <div>
                  <TextInput
                     innerRef={login}
                     placeholder="Логин"
                     className="Home-TextInput"
                  />
               </div>
               <div>
                  <TextInput
                     innerRef={password}
                     placeholder="Пароль"
                     className="Home-TextInput"
                  />
               </div>
               <Button
                  height={40}
                  margin='10px'
                  appearance="primary"
                  onClick={onEnterClick}
               >
                  Войти
               </Button>
            </div>
         </div>
      </div>
   );
}

export default Home;
