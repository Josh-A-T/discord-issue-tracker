# discord-issue-tracker
This will be a full stack application. for now its just the back end

https://dbdiagram.io/d/discord-issue-tracker-68031dcf1ca52373f58bd6d2


Setup
```
    mkdir discord-issue-tracker
    cd discord-issue-tracker
    npm init -y

```
Install dependencies 
```
    npm install express pg sequelize bcrypt jsonwebtoken cors dotenv
    npm install --save-dev nodemon

```


Folder structure
```
discord-issue-tracker/
├── .env
├── package.json
├── server.js
└── src/
    ├── config/
    │   └── db.js
    ├── models/
    │   ├── index.js
    |   ├── Bugs.js
    │   ├── Comments.js
    │   └── Users.js
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── bugs.controller.js
    │   └── comments.controller.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── bugs.routes.js
    │   └── comments.routes.js
    └── middleware/
        └── auth.js
```

/api/auth/login CURL tests

success
```
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@email.com",
    "password": "admin123"
  }'
```

failure
```
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@email.com",
    "password": "wrongpassword"
  }'
```

expected login success response
```
{
  "user": {
    "id": 2,
    "discordId": "9876543210",
    "username": "testuser",
    "email": "user@test.com",
    "isAdmin": false
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

expected login failure response
```
    {
  "error": "Unable to login"
    }
```
