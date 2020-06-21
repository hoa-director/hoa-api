require('dotenv').config();
import { Sequelize, Options, OperatorsAliases } from "sequelize";

const logging = process.env.NODE_ENV === "development" ? true : false;

const connectionOptions: Options = {
  host: process.env.DATABASE_HOST,
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
  },
  define: {
    underscored: true,
    paranoid: true,
  },
  logging
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
  
}

export const connection = new DatabaseConnection().sequelize;
export default connection;
