# Description
Developed by Raghib Khesal for Oxinus Test
NodeJS / Express / SQLite / TypeORM / Oauth2
OAuth for **Github**

Current Repository
https://github.com/raghibdev2001/oxinus.git

Tested with Nodejs  v18.0.0


# Requirements
- [Node.js](https://nodejs.org/) >= v18.0.0
- [SQLite](https://www.sqlite.org/index.html)

# Clone the project
$ git clone https://github.com/raghibdev2001/oxinus.git
$ cd oxinus
$ npm i
// OR 
$ yarn

Run the SQLite migration via TypeORM
$ npm run typeorm migration:run
// OR 
$ yarn typeorm migration:run
$ npm run dev
// OR
$ yarn dev

The API server will start using the `PORT` specified in `.env` file (default 3000).
$ yarn typeorm migration:generate -n your_migration_name
$ yarn typeorm migration:run


For a fast set up, use this POSTMAN file: [api_sample](../oxinus/media/oxinus.postman_collection.json)

create account `api/accounts/register`
POST api/accounts/register
Content-Type: application/json
{
    "firstname":"Raghib",
    "lastname":"Khesal",
    "email":"test@yopmail.com",
    "phone":"123123211313112",
    "password":"passwordAasd",
    "birthday":"2022-12-14"
    
}


Account Login`api/accounts/login`
POST /api/users/login
Content-Type: application/json
{    
    "email":"test@yopmail.com",
    "password":"passwordAasd"
}

Account Logout `api/users/logout
POST api/users/logout
Content-Type: application/json
authorization: JWT_TOKEN (returned by Login request)
{
    "token":"JWT_TOKEN"
}


