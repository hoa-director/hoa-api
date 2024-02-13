import * as Sequelize from 'sequelize';
import User from './user';

export class Unit extends Sequelize.Model {
  id: number;
  userId: number;
  associationId: number;
  addressLineOne: string;
  addressLineTwo: string;
  city: string;
  state: string;
  zip: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  user: User;

  public static initialize(sequelize) {
    Unit.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          unique: true,
          autoIncrement: true,
          field: 'id',
        },
        userId: {
          type: Sequelize.INTEGER,
          field: 'user_id',
        },
        associationId: {
          type: Sequelize.INTEGER,
          field: 'association_id',
        },
        addressLineOne: {
          type: Sequelize.STRING(100),
          field: 'address_line_one',
        },
        addressLineTwo: {
          type: Sequelize.STRING(100),
          field: 'address_line_two',
        },
        city: {
          type: Sequelize.STRING(60),
          field: 'city',
        },
        state: {
          type: Sequelize.STRING(45),
          field: 'state',
        },
        zip: {
          type: Sequelize.INTEGER,
          field: 'zip',
        },
      },
      { sequelize, tableName: 'units' },
    );
  }

  public static asscociate(model) {}

  public static getUsersUnit(userId: number, associationId: number) {
    return this.findOne({
      where: {
        userId,
        associationId,
      },
    });
  }
}

export const UnitSchema = Unit;
export default UnitSchema;
