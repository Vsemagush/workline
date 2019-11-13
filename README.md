# Workline

## Fast start
- npm i
- npm run build

## Step by step
- установить git https://git-scm.com/
- git clone https://github.com/alserz1/workline.git
- открыть проект в удобной IDE 
  - VS - https://code.visualstudio.com/ + установить extensions:
    - Live Server
    - Gitlens
    - Debugger for Chrome
    - Eslint
  - WebStorm (WS) - https://www.jetbrains.com/webstorm/download/
- установить NPM https://www.npmjs.com/get-npm
- открыть терминал в IDE 
- npm i
- npm run build
- `/build/options/index.html` 
  - VS: menu -> open with Live Server
  - WS: menu -> open chrome...
- settings ESLint
  - VS: `.vscode/settings.json` - заменить на свой путь до конфига в корне
  - WS: подключить в настройках для проекта

## Production
Сборка проекта для тестирования в браузере 
- npm run build:production

## Structure
- `/src` ресурсы проекта
  - `/src/background/`
  - `/src/content/` 
  - `/src/options/`
  - `manifest.json` - настройки для расширения хрома

## React


## Wasaby


## Utils
`du hs workline` - размер директории bash