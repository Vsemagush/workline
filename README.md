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
npm i
```
```bash 
npm run build
```
```
открыть в Chrome `chrome://extensions` и перенести папку build туда
```
```
открыт <путь расширения>/options/index.html
```

## Step by step
- Установить GIT https://git-scm.com/
- Открыть терминал
- `git clone https://github.com/alserz1/workline.git`
- Открыть проект в удобной IDE 
  - VS - https://code.visualstudio.com/ + установить extensions:
    - Live Server
    - Gitlens
    - Debugger for Chrome
    - Eslint
  - WebStorm (WS) - https://www.jetbrains.com/webstorm/download/
- Установить NPM https://www.npmjs.com/get-npm
- `npm i` - установка приложения и зависимостей
- `npm run build` - сборка приложения
- settings ESLint - линтер для анализа кода
  - VS: работает без дополнительных настроек
  - WS: подключить в настройках для проекта
- Перейти  `chrome://extensions` - включить режим разработчика
- Перенести папку `./build` на страницу расширений
- Открыть подробную информацию о расширении
- Параметры расширения (3 снизу настройка)
- Откроется страница вида (id будет уникальный): `chrome-extension://ileopabmfgojgnmihokibiaigdcokhjd/options/index.html`

## Production
Сборка проекта для тестирования в браузере
- `npm run build:production`

## Structure
- `/src` - ресурсы проекта
  - `/src/background/` - служебная станица взаимодействий
  - `/src/content/` - для данных на конечной странице
  - `/src/controller/` - отслеживание действий на странице
  - `/src/options/` - основная страница расширения
  - `manifest.json` - настройки для расширения хрома
- `/build` - собранное приложение

## React - FAQ
- https://ru.reactjs.org/docs/getting-started.html

- https://reactjs.org/tutorial/tutorial.html
- https://reactjs.org/docs/hooks-intro.html
- https://reactjs.org/docs/fragments.html
- https://reactjs.org/docs/portals.html
- https://reactjs.org/docs/refs-and-the-dom.html

## Wasaby - FAQ
- https://wasaby.dev/
- https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/notification/
- https://wi.sbis.ru/icons/?v=20.1000

## GIT - FAQ
- наименование веток: `dev/<инициалы.фамилия>/message-with-info`, например `dev/mu.slastuhin/add-controller`

## Определения и термины
- Модуль - js файл с определенной логикой
- Линтер - утилита проверки корректности кода
- Бандл - исходники собранные через webpack
- Контроллер - модуль содержащий логику управления и передачи данных другим модулям

## Helpers and commands
- `du hs workline` - размер директории bash
- `clear` - очистить консоль терминала
- `npm run reset` - сброс директории к дефолту, только для osx/nix