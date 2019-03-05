# Поздравлялка на 8 марта

Веб-сервис поздравлению девушек с 8 марта.

# Тебования
Для запуска нужен Python 3+ и библиотеки:
* flask
* jwt
* requests

# Запуск

Перед запуском нужно добавить файл `settings.json` в корень репозитория. В нем должны быть следующие настройки:
```json
{
    "service_account_id": "string", // идентификатор сервисного аккаунта в yandex.cloud 
    "key_id": "string", // идентификатор ключа сервисного аккаунта по которому будет проходить авторизация
    "folder_id": "string", // идентификатор каталога в yandex.cloud
    "private_key_path": "string" // путь до закрытого ключа, с которым связан `key_id`
}
```
Нужно, чтобы по `private_key_path` лежал файл с закрытым ключом. Хорошо, если это будет файл с расширением `*.pem`

Про то, что такое *сервисный аккаунт*, *ключ сервисного аккаунта* и *каталог в yandex.cloud* можно узнать в [документации](https://cloud.yandex.ru/docs). Для упрощения:
* [регистрация и получение доступа к yandex.cloud](https://cloud.yandex.ru/docs/billing/quickstart/)
* [каталог](https://cloud.yandex.ru/docs/resource-manager/quickstart)
* [сервисный аккаунт](https://cloud.yandex.ru/docs/iam/concepts/users/service-accounts)
* [ключ сервисного аккаунта](https://cloud.yandex.ru/docs/iam/concepts/authorization/key) и [его создание](https://cloud.yandex.ru/docs/iam/operations/iam-token/create-for-sa#keys-create)

Для запуска можно использовать `start.bat`

# PS

Пока сервис запускается только в development режиме