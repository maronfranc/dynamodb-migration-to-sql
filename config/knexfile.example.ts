const { FsMigrations } = require('knex/lib/migrate/sources/fs-migrations')


export const connection = {
    host: "localhost",
    user: "postgres",
    database: "name",
    password: "123456",
    requestTimeout: 60000,
    timezone: "utc",
    options: {
        encrypt: true
    }
}

module.exports = {
    client: "pg",
    connection,
    migrations: {
        tableName: "migrations",
        migrationSource: new FsMigrations("../migrations", false),
        // directory: "../migrations"
    }
};
