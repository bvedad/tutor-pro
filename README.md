# Tutorpro

Tutorpro in MEAN stack (Mongo, Express, Angular, Node)
[App demo](https://tutor-pro.herokuapp.com)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development purposes.

### Prerequisites

What things you need to install the software and how to install them

```
MongoDB (3..6.3)
Node.js (8.10.0)
NPM (3.5.2)
npm install -g nodemon
```

### Installing

A step by step series of examples that tell you how to get a development env running

Install dependencies

```
npm install
```

Start mongodb(Ubuntu)

```
sudo service mongod start
```

Start mongodb(Mac)

```
sudo mkdir -p /data/db
sudo mongod
```

Start backend

```
nodemon
```

## Built With

* [npm](https://github.com/npm/npm) - Dependency Management
* [expressjs](https://github.com/expressjs/express) - Routing HTTP requests
* [Angular.js](https://github.com/angular/angular.js/) - The web framework used
* [Mongodb](https://github.com/mongodb/mongo) - Database used
* [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - JsonWebToken implementation for node.js
* [express-jwt](https://github.com/auth0/express-jwt) - Express middleware that validates a JsonWebToken (JWT) and set the req.user with the attributes
* [passport](https://github.com/jaredhanson/passport) - Simple, unobtrusive authentication for Node.js.
* [mongoose](https://github.com/Automattic/mongoose) - MongoDB object modeling designed to work in an asynchronous environment.
* [mongoose-unique-validator](https://github.com/blakehaswell/mongoose-unique-validator) - mongoose-unique-validator is a plugin which adds pre-save validation for unique fields within a Mongoose schema.

## Authors

* **Vedad Burgic** - *Initial work* - [bvedad](https://github.com/bvedad)
