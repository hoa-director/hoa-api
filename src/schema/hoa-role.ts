import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import User from "./user";
import { HomeOwnerAssociation } from "./home-owner-association";

export class HoaRole extends Model<InferAttributes<HoaRole>, InferCreationAttributes<HoaRole>> {
  declare id: number;
  declare userId: ForeignKey<User["id"]>;
  declare homeOwnerAssociationId: ForeignKey<HomeOwnerAssociation["id"]>;
  declare roleId: number | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: Date | null;

  public static initialize(sequelize: any) {
    HoaRole.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          unique: true,
          autoIncrement: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false
        },
        homeOwnerAssociationId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        roleId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true
        },
      },
      { sequelize },
    );
  }
}