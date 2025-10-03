# LogicLike Project

## 🛠 Технологический стек

**Backend:**
- Node.js (TypeScript)
- Express.js
- PostgreSQL
- TypeORM

**Frontend:**
- React (TypeScript)
- i18Next (интернационализация)
- Bootstrap (UI компоненты)

## 📋 Системные требования

- Node.js 18+
- PostgreSQL 16+
- Make (для автоматизации)

## ⚙️ Установка и настройка

### Предварительные требования

Убедитесь, что установлен Make:
```bash
sudo apt install make
```

Создайте схему "idea" в тестовой базе данных (необходимо сделать самостоятельно):
```sql
CREATE SCHEMA idea
```

В корне папки с сервером (backend) создайте файл .env с настройками:
```bash
PORT=3011 (если меняете, обновите также поле proxy в frontend/package.json)
DB_LOCAL="test" <--- вставьте сюда вашу тестовую базу данных от PostgreSQL
USER_DB_LOCAL="login" <--- вставьте сюда ваш логин пользователя от PostgreSQL
PASSWORD_DB_LOCAL="password" <--- вставьте сюда ваш пароль пользователя от PostgreSQL
```

## Установка проекта
Рекомендуемый способ установки через Makefile:
```bash
make install
```

Эта команда автоматически:
- Установит зависимости для backend и frontend
- Применит миграции к PostgreSQL
- Заполнит базу тестовыми данными (12 идей)

## 🚀 Запуск проекта
После успешной установки запустите в корне проекта в двух отдельных терминалах:

Терминал 1 (Backend):
```bash
make start-backend
```
Терминал 2 (Frontend): 
```bash
make start-frontend
```

Примечание: Первая компиляция может занять некоторое время.

Страница браузера откроется автоматически после запуска frontend.

## 🌐 Демо версия
Пример работающего приложения доступен по адресу: https://portfolio.am-projects.ru/ideas/

## 📁 Структура проекта
project/

├── backend/          # Серверная часть (Node.js + Express + TypeORM)

├── frontend/         # Клиентская часть (React + TypeScript)

├── .env             # Конфигурация окружения

└── Makefile         # Автоматизация процессов