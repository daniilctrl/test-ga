# GREEN-API Test Page

Страница для вызова методов [GREEN-API](https://green-api.com/):
`getSettings`, `getStateInstance`, `sendMessage`, `sendFileByUrl`.

Чистый HTML/CSS/JS, без сборки и зависимостей.

## Запуск

Открыть `index.html` в браузере. Или поднять статикой:

```bash
python -m http.server 8080
# http://localhost:8080
```

## Использование

1. Создать инстанс в личном кабинете GREEN-API, подключить WhatsApp по QR.
2. Ввести `idInstance` и `ApiTokenInstance`.
3. Нажать нужный метод:
   - `getSettings` — настройки инстанса.
   - `getStateInstance` — состояние авторизации.
   - `sendMessage` — текст. Номер: только цифры с кодом страны, без `+`.
   - `sendFileByUrl` — файл по URL, имя берётся из URL.
4. Ответ — справа, в read-only поле, в виде JSON.

## Структура

```
index.html   разметка
styles.css   стили
app.js       вызовы API
```

## Публикация

GitHub Pages: запушить папку в репозиторий, включить Pages из ветки `main`, корень `/`.
