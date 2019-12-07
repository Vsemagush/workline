import React, { useCallback, useRef } from 'react';
import { Button } from 'evergreen-ui';
import { useHistory } from 'react-router-dom';
import ParticleComponent from './ParticleComponent';

/** Главная страница - страница авторизации */
function HomeDemo() {
   const history = useHistory();

   /** Обработчик нажатия на "Войти как админимтратор" */
   const onAdminClick = useCallback(() => {
      localStorage.setItem('userName', 'admin');
      history.replace('/admin');
   }, [history]);

   /** Обработчик нажатия на "Авторизация" */
   const onEnterClick = useCallback(() => {
      history.replace('/');
   }, [history]);

   return (
      <div className="particlejs_div">
         <ParticleComponent/>
         <div className="particlejs_div">
            <div className="Home-Form">
               <div>
                <span className="Home-TopBar__logoBlock">
                    <img className="Home-TopBar__logo" src="../../assets/logo.png"></img>
                </span>
                  <span className="Home-TopBar__header">Workline</span>
               </div>
               <div className="disp-flex">
               <Button
                  height={100}
                  fontSize={30}
                  margin="10px"
                  className="HomeButton"
                  appearance="primary"
                  intent="danger"
                  justifyContent="center"
                  onClick={onAdminClick}
               >
                  Войти как администратор
               </Button>
               <Button
                  height={100}
                  margin="10px"
                  justifyContent="center"
                  className="HomeButton"
                  fontSize={30}
                  appearance="primary"
                  onClick={onEnterClick}
               >
                  Авторизация
               </Button>
               </div>
            </div>
         </div>
      </div>
   );
}

export default HomeDemo;
