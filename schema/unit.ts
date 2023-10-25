import {
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Op,
  CreationOptional,
  Sequelize,
  NonAttribute,
  ForeignKey,
} from 'sequelize';
import User from './user.js';
import { HomeOwnerAssociation } from './home-owner-association.js';

export class Unit extends Model<InferAttributes<Unit>, InferCreationAttributes<Unit>> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User["id"]>;
  declare hoaId: ForeignKey<HomeOwnerAssociation["id"]>;
  declare addressLineOne: string;
  declare addressLineTwo: string | null;
  declare city: string;
  declare state: string;
  declare zip: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: Date | null
  user: any;

  public static initialize(sequelize: any) {
    Unit.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          unique: true,
          autoIncrement: true,
        },
        userId: {
          type: DataTypes.INTEGER,
        },
        hoaId: {
          type: DataTypes.INTEGER,
        },
        addressLineOne: {
          type: new DataTypes.STRING(100),
          allowNull: false
        },
        addressLineTwo: {
          type: new DataTypes.STRING(100),
          allowNull: true
        },
        city: {
          type: new DataTypes.STRING(60),
          allowNull: false
        },
        state: {
          type: new DataTypes.STRING(45),
          allowNull: false
        },
        zip: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true
        },
        user: ''
      },
      { sequelize },
    );
  }

  public static getUsersUnit(userId: number, hoaId: number) {
    return this.findOne({
      where: {
        userId,
        hoaId,
      },
    });
  }
}

export const UnitSchema = Unit;
export default UnitSchema;
