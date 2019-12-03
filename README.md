# Workline
Кураторы:
- Сластухин Максим (@vsemagush)
- Зайцев Александр (@alserz1)
- Груздева Наталья (@natataliya)

Вводные:
- Trello - https://trello.com/b/NqPqEMyP/workline
- Test-аккаунт - https://fix-online.sbis.ru (workline/1qaz2wsx3edc)


## Fast start
```bash 
yarn install
```
```bash 
yarn build
```
```
открыть в Chrome `chrome://extensions` включить режим разработчика и перенести папку `/build` туда
```
```
открыть информацию о расширении и  3 пункт снизу
```

## Step by step
- Установить GIT https://git-scm.com/
- Открыть терминал
- `git clone https://github.com/alserz1/workline.git`
- Открыть проект в удобной IDE: 
  - VS - https://code.visualstudio.com/ + установить extensions:
    - Gitlens
    - Eslint
  - WebStorm (WS) - https://www.jetbrains.com/webstorm/download/
- Установить YARN - https://yarnpkg.com/lang/ru/docs/install/
- `yarn install` - установка приложения и зависимостей
- `yarn build` - сборка приложения
- settings ESLint - линтер для анализа кода
  - VS: работает без дополнительных настроек
  - WS: подключить в настройках для проекта
- Перейти  `chrome://extensions` - включить режим разработчика
- Перенести папку `./build` на страницу расширений
- Открыть подробную информацию о расширении
- Параметры расширения (3 снизу настройка)
- Откроется страница вида (id будет уникальный): `chrome-extension://ileopabmfgojgnmihokibiaigdcokhjd/options/index.html`
- Авторизоваться на [fix-online](https://fix-online.sbis.ru) и совершить клик - на странице расширения появиться информация о событии, на странице уведомление

## Production
Сборка проекта для тестирования в браузере
- `yarn build:production`

## Structure
- `/src` - ресурсы проекта
  - `/src/background/` - служебная станица взаимодействий
  - `/src/content/` - создает объекты для взаимодействия расширения с текущей страницей
  - `/src/controller/` - отслеживание действий на странице через подписантов
  - `/src/options/` - главная страница расширения
  - `/src/storage/` - содержит API CRUD к БД
  - `manifest.json` - настройки расширения
- `/build` - собранный продукт

Проект состоит из 3 основных частей
-  Страницы отображения прогресса `/options/*`
-  Контроллер отслеживания событий на странице `/controller/*`
-  Контроль взаимодействия между модулями `/background/*`

## React - FAQ
- https://ru.reactjs.org/docs/getting-started.html

- https://ru.reactjs.org/tutorial/tutorial.html
- https://ru.reactjs.org/docs/hooks-intro.html
- https://ru.reactjs.org/docs/fragments.html
- https://ru.reactjs.org/docs/portals.html
- https://ru.reactjs.org/docs/refs-and-the-dom.html

## Wasaby - FAQ
- https://wasaby.dev/
- https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/notification/
- https://wi.sbis.ru/icons/?v=20.1000

## UI - библиотека визуальных компонентов Evergreen
- https://evergreen.segment.com/components/

## GIT - FAQ
- наименование веток: `dev/<инициалы.фамилия>/message-with-info`, например `dev/mu.slastuhin/add-controller`

## DataBase - FireBase
- https://firebase.google.com/docs/database/web/read-and-write - базовые операции
- https://firebase.google.com/docs/database/security/quickstart - работа с доступом
- https://firebase.google.com/docs/database/web/lists-of-data - сортировки и агрегации

## Deploy - развертывание приложения на хостинге (только для Кураторов)
- https://console.firebase.google.com/project/workline-71bd0/hosting
- `yarn install firebase-tools`
- `firebase login`
- Настройка разворота и путей до `index.html` находится в `firebase.json`
- `yarn deploy` - тестовая версия
- `yarn deploy:production` - разворот релизной версии
- https://workline-71bd0.firebaseapp.com/options/index.html


## Определения и термины
- Модуль - js файл с определенной логикой
- Линтер - утилита проверки корректности кода
- Бандл - исходники собранные через webpack
- Контроллер - модуль содержащий логику управления и передачи данных другим модулям
- БД - база данных
- Firebase - условно бесплатная база данных, где будем хранить все

## Help
- `yarn reset` - сброс директории к дефолту, только для osx/nix