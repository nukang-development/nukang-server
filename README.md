# nukang-server

## User

List of available endpoints:

- `POST /register`
- `POST /login`
- `POST /order`
- `GET /order/:id`
- `GET /tukang/:id/detail`

### POST /register

Request:

- data:

```json
{
  "email": "string",
  "password": "string"
}
```

Response:

- status: 201
- body:
  ​

```json
{
  "id": "string",
  "email": "string"
}
```

### POST /login

Request:

- data:

```json
{
  "email": "string",
  "password": "string"
}
```

Response:

- status: 200
- body:
  ​

```json
{
  "access_token": "string"
}
```

### POST /order

Request:

- data:

```json
{
  "userId": "string",
  "tukangId": "string",
  "schedule": "date",
  "contact": "string",
  "address": "string",
  "total_price": "number"
}
```

Response:

- status: 201
- body:
  ​

```json
{
  "userId": "string",
  "tukangId": "string",
  "schedule": "date",
  "contact": "string",
  "address": "string",
  "total_price": "number",
  "comment": "string",
  "status": "string"
}
```

### GET /order/:id

Request:

- params:

```json
{
  "id": "userId"
}
```

Response:

- status: 200
- body:
  ​

```json
{
  "userId": "string",
  "tukangId": "string",
  "schedule": "date",
  "contact": "string",
  "address": "string",
  "total_price": "number",
  "comment": "string",
  "status": "string"
}
```

### GET /tukang/:id/detail

Request:

- params:

```json
{
  "id": "tukangId"
}
```

Response:

- status: 200
- body:
  ​

```json
{}
```
