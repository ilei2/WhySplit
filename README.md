# WhySplit
Why Split

## Initialization
Create a local `.env` file and fill in the inputs needed to connect to a local MongoDB. See `.env.example` for reference.

## Instructions on how to run

Initialize packages with "npm install".

Run "npm start" to begin service. If successful, the terminal log "Server started at..."

Use "npm run dev" for development testing.

Use the following templates below and test on postman:

```
POST User
http://localhost:XXXX/users
{
    name: "jane"
    email: "jane.doe@gmail.com"
}

GET User
http://localhost:XXXX/users/<userId>

POST Transaction
http://localhost:XXXX/transaction
{
  "description": "Description",
  "category": "General",
  "totalAmount": 25,
  "payer": "userId1", 
  "participants": [
    "userId1", 
    "userId2", 
    "userId3"
  ]
}

GET Transaction
http://localhost:XXXX/transaction/<transactionId>

PUT Transaction
http://localhost:XXXX/transaction/<transactionId>
{
  "description": "Description",
  "category": "General",
  "totalAmount": 10,
}
```