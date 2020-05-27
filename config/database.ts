import { Sequelize, Options, OperatorsAliases } from "sequelize";

const logging = process.env.NODE_ENV === "development" ? console.log : false;

// const connectionOptions: Options = {
//   host: process.env.DATABASE_HOST,
//   dialect: 'mysql',
//   pool: {
//     max: 10,
//     min: 0,
//   },
//   define: {
//     underscored: true,
//     paranoid: true,
//   },
//   logging,
//   operatorsAliases: false,
// };

// class DatabaseConnection {
//   sequelize: Sequelize;

//   constructor() {
//     this.sequelize = new Sequelize(
//       process.env.DATABASE_DB,
//       process.env.DATABASE_USER,
//       process.env.DATABASE_PASSWORD,
//       connectionOptions,
//     );
//   }

class DatabaseConnection {
  sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize(process.env.JAWSDB_URL);
  }

  testConnection() {
    this.sequelize
      .authenticate()
      .then(() => {
        console.log("connected to database");
      })
      .catch((error) => {
        console.log("There was an error connecting to the database");
        console.error(error);
      });
  }
}

export const connection = new DatabaseConnection().sequelize;
export default connection;
