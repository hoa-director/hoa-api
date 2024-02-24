import { DataTypes, InferAttributes, InferCreationAttributes, Model, ForeignKey, CreationOptional } from "sequelize";
import User from "./user";

export class ContactInformation extends Model<InferAttributes<ContactInformation>, InferCreationAttributes<ContactInformation>>
{
  declare id: number;
  declare userId: ForeignKey<User["id"]>;
  declare firstName: string;
  declare lastName: string;
  declare phoneNumber: string;
  declare primaryEmail: string;
  declare secondaryEmail: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: Date | null;

  public static initialize(sequelize: any) {
    ContactInformation.init(
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
        firstName: {
            type: new DataTypes.STRING,
            allowNull: false
          },
        lastName: {
            type: new DataTypes.STRING,
            allowNull: false
          },
        phoneNumber: {
          type: new DataTypes.STRING(45),
          allowNull: false
        },
        primaryEmail: {
          type: new DataTypes.STRING(45),
          allowNull: false,
        },
        secondaryEmail: {
          type: new DataTypes.STRING(45),
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