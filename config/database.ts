require("dotenv").config();
import { Sequelize, Options, OperatorsAliases } from "sequelize";
const url = require("url");
class DatabaseConnection {
  sequelize: Sequelize;

  constructor() {
    if (process.env.DATABASE_URL) {
      const connectionOptions: Options = {
        pool: {
          max: 10,
          min: 0,
        },
        define: {
          underscored: true,
          paranoid: true,
        },
        logging:
          process.env.NODE_ENV === "staging"
            ? (...msg) => console.log(msg)
            : false,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false, // very important
          },
        },
      };

      this.sequelize = new Sequelize(
        `${process.env.DATABASE_URL}?sslmode=require`,
        connectionOptions
      );
    } else {
      const connectionOptions: Options = {
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
        logging: (...msg) => console.log(msg),
      };
      this.sequelize = new Sequelize(
        process.env.DATABASE_DB,
        process.env.DATABASE_USER,
        process.env.DATABASE_PASSWORD,
        connectionOptions
      );
    }
    this.testConnection();
    this.synchronize();
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
    (await process.env.NODE_ENV) === "development" ||
    process.env.NODE_ENV === "staging"
      ? this.sequelize.sync({ alter: true })
      : this.sequelize.sync();
  }
}

export const connection = new DatabaseConnection().sequelize;
export default connection;
