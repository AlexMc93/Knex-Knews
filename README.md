# KNEX KNEWS API :newspaper: :clipboard:

This is an API featuring data on topics, articles, users and comments in the style of Reddit.

Please find a hosted version of this repo [here](https://alex-mc-news-app.herokuapp.com/api/). From the `/api` endpoint you can view a list of all endpoints that can be requested.

This project formed part of the back-end phase of my time on the Northcoders full-stack bootcamp and was primarily created on a week-long sprint in January 2021.

This project utilizes the following tech:

- [PostgreSQL](https://www.postgresql.org/) - database management
- [Express](https://expressjs.com/) - server building
- [Knex](http://knexjs.org/) - seeding & querying
- [Jest](https://jestjs.io/) & [Supertest](https://www.npmjs.com/package/supertest) - testing
- [Heroku](https://www.heroku.com/) - hosting

In addition, Insomnia Core was used during development for additional testing of API endpoints.

## Set-up

If you would like to clone this repository to use, do so by running the following terminal command while in the desired working directory:

```
git clone https://github.com/AlexMc93/Knex-Knews.git
```

You will need to have installed [node.js](https://nodejs.org/en/) (v14.14.0 or later), a back-end JavaScript runtime environment, and [PostgreSQL](https://www.postgresql.org/) (v12.5 or later), a relational database management system.

To install the other dependencies run the following command from the terminal:

```
npm install
```

This will install:

- express: a web application framework providing the server-side logic;
- jest: a testing framework;
- knex: an SQL query and schema builder that will seed and interact with the database;
- supertest: another module for testing, specifically for the HTTP endpoints;
- pg: node-postgres, a module for interfacing with the PostgreSQL database.

Finally, you can run the following command from the terminal in order to create both the development and test databases respectfully:

```
npm run setup-dbs
```

This will run the file `/db/setup.sql`, dropping the development and test databases if they exist and then creating new empty ones ready to populate with data.

## Data

In the `/db/data` folder you will find development data and test data. When the test files are run, our node process environment is set to 'test' so that it is the test data being used. Otherwise, unless specified otherwise by the user (by setting process.env.NODE_ENV = 'test'), it will default to using the development data everywhere else.

## Knexfile.js configuration

As mentioned above, Knex is an SQL query builder allowing us to interact with the database. There is some configuration to do in order for it to work properly on the version you have cloned. A template file has been provided to assist with this: `knexfile-template.js`. This file **MUST** be renamed `knexfile.js`! If you are running a Linux system, you will need to provide a valid value for the user and password properties on the customConfig object, for both development and test. This is your PostgreSQL username and password. Alternatively you could set up a [`.pgpass` file](https://www.postgresql.org/docs/9.4/libpq-pgpass.html).

## Schemas

In the `db/migrations` folder you will find the files used to create the tables and their respective columns using knex. This will give you a clear guide as to what data types are valid, which fields must have values (ie. `notNullable()`), which values are foreign keys etc. If you wish to make adjustments you can use the following command to create a new migration:

```
npm run migrate-make
```

## Seeding

The seed file can be found at `/db/seeds/seed.js`. When run, the seed function will automatically make sure the database has no old data in it (migrate-rollback), followed by making sure the schema is up to date with the latest version (migrate-latest).

To seed the development database run the following command:

```
npm run seed
```

To seed the test database instead, run the following command:

```
npm run seed-test
```

## Testing

To run the test suite, use the command:

```
npm test
```

By adding `app` or `utils` at the end of the command, you can specify which aspect you would like to test - app being the server responses and utils being the utility functions which manipulate the data.

## Run locally

To run the server locally, you can use the following command:

```
npm run start
```

This will start the server listening on port 9090 and you will see confirmation of this in the terminal. You can change the port by adjusting the `listen.js` file.

While the server is listening on a local port, you can use an application like [Insomnia](https://insomnia.rest/) to make requests and view responses.

## Run remotely

To run the server on a remote database I would recommend using Heroku, more details can be found [here](https://devcenter.heroku.com/articles/getting-started-with-nodejs)

## Requests

You can find a list of all available routes in the file `endpoints.json`. To understand how a request to the server is handled, please explore the `routers`, `controllers` and `models` folders. This follows the pattern of MVC design. Finally, you can find error handling is dealt with in the file `controllers/error-handling.js`.

## Contributors

I initially started on this project pair-programming with [Melissa Astbury](https://github.com/MelissaAstbury), a fellow Northcoder and an excellent Software Engineer!

## To-do list

- Front-End! (coming soon...)
- Added functionality so users can log in
- More endpoints, query and pagination options
- Protection for endpoints with JWT authorization

### Any comments, feedback or questions are welcome. Thanks for reading!
