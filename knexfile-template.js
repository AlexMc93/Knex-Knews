const ENV = process.env.NODE_ENV || 'development';
const { DB_URL } = process.env;

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfig = {
  development: {
    connection: {
      database: 'knex_knews'
      // user,
      // password
    }
  },
  test: {
    connection: {
      database: 'knex_knews_test'
      // user,
      // password
    }
  },
  production: {
    connection: {
      connectionString: DB_URL,
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };