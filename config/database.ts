require("dotenv").config();
import { Sequelize, Options, OperatorsAliases } from "sequelize";
const url = require('url');

const isDevEnv = process.env.NODE_ENV === "development";
const isStagingEnv = process.env.NODE_ENV === "staging";
let connectionOptions: Options;

if (process.env.DATABASE_URL) {
  const params = url.parse(process.env.DATABASE_URL);
  connectionOptions = {
    host: params.hostname,
    dialect: "postgres",
    port: params.hostname,
    ssl: true,
    pool: {
      max: 10,
      min: 0,
    },
    define: {
      underscored: true,
      paranoid: true,
    },
    logging:
        isStagingEnv
        ? (...msg) => console.log(msg)
        : false
  }
} else {
  connectionOptions = {
    host: process.env.DATABASE_HOST,
    dialect: "postgres",
    port: 5432,
    pool: {
      max: 10,
      min: 0,
    },
    define: {
      underscored: true,
      paranoid: true,
    },
    logging: (...msg) => console.log(msg)
  };
}
class DatabaseConnection {
  sequelize: Sequelize;

  constructor() {
    if (process.env.DATABASE_URL) {
      const params = url.parse(process.env.DATABASE_URL);
      this.sequelize = new Sequelize(process.env.DATABASE_URL, connectionOptions);
    } else {
      this.sequelize = new Sequelize(
        process.env.DATABASE_DB,
        process.env.DATABASE_USER,
        process.env.DATABASE_PASSWORD,
        connectionOptions
      );
    }
    this.testConnection();
    this.synchronize()
  }

  testConnection() {
    this.sequelize
      .authenticate()
      .then(() => {
        console.log("Connected to database");
      })
      .catch((error) => {
        console.log("There was an error connecting to the database");
        console.error(error);
      });
  }

  async synchronize() {
    await isDevEnv || isStagingEnv ? this.sequelize.sync({ alter: true }) : this.sequelize.sync();
  }
}

export const connection = new DatabaseConnection().sequelize;
export default connection;
