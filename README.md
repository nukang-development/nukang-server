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
  "userId": "600e4cd5d037cc1580f1ab6e",
  "tukangId": "600e5cfcd362231dc89ca808",
  "schedule": "23-01-2021",
  "contact": "080190",
  "address": "jakarta",
  "total_price": "100"
}
```

Response:

- status: 201
- body:
  ​

```json
{
  "userId": "600e4cd5d037cc1580f1ab6e",
  "tukangId": "600e5cfcd362231dc89ca808",
  "schedule": "23-01-2021",
  "contact": "080190",
  "address": "jakarta",
  "total_price": "100",
  "comment": "",
  "status": "pending",
  "_id": "600e5e46b3a0be261cb9638a"
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
[
  {
    "_id": "600e5e46b3a0be261cb9638a",
    "userId": "600e4cd5d037cc1580f1ab6e",
    "tukangId": "600e5cfcd362231dc89ca808",
    "schedule": "23-01-2021",
    "contact": "080190",
    "address": "jakarta",
    "total_price": "100",
    "comment": "",
    "status": "pending"
  }
]
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
{
  "id": "600e5cfcd362231dc89ca808",
  "name": "tukang baru",
  "location": "jawa",
  "category": "tukang kayu",
  "small_project_desc": "kecil",
  "small_project_price": "10",
  "medium_project_desc": "medium",
  "medium_project_price": "20",
  "big_project_desc": "big",
  "big_project_price": "30",
  "portofolio_img": []
}
```

### GET /user/:id

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
  "id": "600e4cd5d037cc1580f1ab6e",
  "email": "user1",
  "name": "user1"
}
```

### GET /user/tukang

Response:

- status: 200
- body:
  ​

```json
[
  {
    "_id": "600e5cfcd362231dc89ca808",
    "username": "tukangbatu",
    "password": "$2a$10$8BhvdbZDgM8FWFrtNZaode9FVHlZZOXZGwgsYueWyXbtu3NuaJlde",
    "role": "tukang",
    "name": "tukang baru",
    "location": "jawa",
    "category": "tukang kayu",
    "small_project_desc": "kecil",
    "small_project_price": "10",
    "medium_project_desc": "medium",
    "medium_project_price": "20",
    "big_project_desc": "big",
    "big_project_price": "30",
    "portofolio_img": []
  }
]
```
