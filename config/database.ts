require("dotenv").config();
import { Sequelize, Options, OperatorsAliases } from "sequelize";

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
  logging: process.env.NODE_ENV === "development" ? (...msg) => console.log(msg) : false,
};

class DatabaseConnection {
  sequelize: Sequelize;

  constructor() {
    if (process.env.JAWSDB_URL) {
      this.sequelize = new Sequelize(process.env.JAWSDB_URL);
    } else {
      this.sequelize = new Sequelize(
        process.env.DATABASE_DB,
        process.env.DATABASE_USER,
        process.env.DATABASE_PASSWORD,
        connectionOptions
      );
    }
    this.testConnection();
    process.env.NODE_ENV === "development" ? this.synchronize() : null;
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
    await this.sequelize.sync({ alter: true});
  }
}

export const connection = new DatabaseConnection().sequelize;
export default connection;
