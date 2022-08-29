# AE Points Bot

## Как запустить бота
1. Скопировать этот репозиторий `git clone https://github.com/n9delta/ae-points-bot`
2. Создать файл `.env` с соответствующими переменными
3. Инициализировать базу данных `npm run dbInit`
4. Запустить бота `npm run start` или `npm run pm2start`

## Переменные .env
Name | Description
--- | --- |
`TOKEN` | Токен бота
`ID` | Айди бота
`GUILD` | Айди гильдии, куда отсылать команды
`ADMINS` | Айди админов в формате (id,id,id)

## Скрипты
- npm run start // Запуск бота
- npm run pm2start // Запуск процесса бота в pm2 (поддержка перезагрузки)
- npm run slashInit // Добавление команд на сервер
- npm run dbSync // Синхронизация базы данных
- npm run dbInit // Синхронизация базы данных с обнулением данных таблиц
