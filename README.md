#   Дневник студента

Телеграм-бот с веб-интерфейсом, позволяющий студентам вести учебный дневник: объединятся в учебные группы, управлять ими, записывать задания, отслеживать дедлайны, управлять расписанием и получать напоминания прямо в Telegram.

---

##  Технологии

### Язык и фреймворки
- **TypeScript** — строгая типизация
- **Next.js 15** — серверно-клиентный фреймворк
- **React 18** — пользовательский интерфейс
- **tRPC** — typesafe API без необходимости писать REST/GraphQL

### База данных
- **PostgreSQL** — хранение данных
- **Drizzle ORM** — типизированная работа с SQL
- **drizzle-kit** — генерация и миграции схем

### Аутентификация
- **crypto** и **encoding** - криптографические библиотеки для авторизации
- **@auth/drizzle-adapter** — хранение сессий в PostgreSQL через Drizzle

### Telegram WebApp
- **@telegram-apps/sdk-react** — UI- и hook-интеграция Telegram внутри React
- **@telegram-apps/init-data-node** — безопасная работа с `initData` на сервере

### Работа с данными
- **@tanstack/react-query** — кеш и управление запросами
- **superjson** — сериализация данных между клиентом и сервером
- **zod** — схемы и валидация данных

### UI и стили
- **Tailwind CSS** — утилитарные стили
- **Geist UI** — готовые компоненты
- **PostCSS** + **prettier-plugin-tailwindcss** — автоформатирование

### Качество кода
- **ESLint** и **Prettier** — проверка и автоформатирование
- **eslint-plugin-drizzle** — linting для ORM
- **typescript-eslint** — поддержка типизированного кода

##  Возможности

-   Создание учебных групп
-   Настройка ролей в учебной группе
-   Добавление предметов и просмотр расписания
-   Запись домашних заданий
-   Уведомления о дедлайнах через Telegram
-   Авторизация по Telegram ID

##  Структура проекта

homework-shedule/
│
├── .vscode/                  # Конфигурации редактора VS Code
├── drizzle/
│   └── meta/                 # Служебные данные Drizzle ORM
├── public/                   # Статические файлы (иконки, картинки, robots.txt)
├── src/                      # Исходный код приложения
│
├── .dockerignore             # Исключения для Docker-контекста
├── .env.example              # Пример переменных окружения
├── .eslintrc.cjs             # Конфигурация ESLint
├── .gitignore                # Исключения для Git
│
├── Dockerfile                # Docker-образ для деплоя
├── README.md                 # Документация проекта
│
├── drizzle.config.ts         # Конфигурация для Drizzle ORM
├── next.config.js            # Конфигурация Next.js
│
├── package.json              # Список зависимостей и npm-скриптов
├── pnpm-lock.yaml            # Лок-файл менеджера пакетов pnpm
│
├── postcss.config.js         # Конфигурация PostCSS
├── prettier.config.js        # Конфигурация Prettier
│
├── start-database.sh         # Скрипт инициализации базы данных (локально)
├── tailwind.config.ts        # Конфигурация Tailwind CSS
├── tsconfig.json             # Конфигурация TypeScript

## 📦 Установка

1.  Клонирование репозитория:

```bash
git clone https://github.com/your-username/homework-shedule.git
cd homework-shedule
```
2.  Создание файла .env на основе .env.example и заполнение его:

```bash
DATABASE_URL=postgres://user:password@localhost:5432/homework_db
TELEGRAM_BOT_TOKEN=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://domain
```

3.  Установка зависимостей:
```shell
pnpm install
```
4.  Запуск с Docker
```bash
docker-compose up --build
```

##  Локальная разработка
```shell
pnpm dev
```

Telegram Web Apps требуют защищённого соединения (HTTPS). Это значит, что ваше приложение должно быть доступно по SSL-сертифицированному адресу (например, https://example.com), иначе Telegram не загрузит его внутри клиента.

Если вы разрабатываете локально, используйте ngrok или аналогичный инструмент для проброса вашего localhost в интернет через HTTPS:

bash
Копировать
Редактировать
npx ngrok http 3000
После запуска вы получите публичный HTTPS-домен (https://your-subdomain.ngrok.io), который можно указать в настройках Telegram-бота как start_parameter или web_app.url.

##  Работа с базой данных

```bash
pnpm db:generate    # генерация миграций из схемы
pnpm db:push        # push схемы в БД
pnpm db:migrate     # выполнение миграций
pnpm db:studio      # визуальный интерфейс
```

##  Проверки и качество кода

```bash
pnpm lint           # проверка eslint
pnpm lint:fix       # автофиксы
pnpm format:check   # проверка форматирования
pnpm format:write   # автоформатирование
pnpm typecheck      # проверка типов
```

##  Авторы

Имя: Данил Пустовалов
GitHub: [@yourusername](https://github.com/rokastxd https://github.com/DanilPustovalov)

Имя: Тимур Валитов
GitHub: [@yourusername](https://github.com/DanilPustovalov)

Имя: Руслан Бормотов
GitHub: [@yourusername]()
