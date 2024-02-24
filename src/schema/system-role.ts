import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import User from "./user";
import { HomeOwnerAssociation } from "./home-owner-association";

export class SystemRole extends Model<InferAttributes<SystemRole>, InferCreationAttributes<SystemRole>> {
  declare id: number;
  declare userId: ForeignKey<User["id"]>;
  declare roleId: number | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: Date | null;

  public static initialize(sequelize: any) {
    SystemRole.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          unique: true,
          autoIncrement: true,
        },
        userId: {
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

    public static async findAllRolesForUser(userId: number): Promise<number[]> {
      const roles = await SystemRole.findAll({
        where: {
          userId: userId,
        },
      });
      var ids = roles.map((role) => role.roleId);
      return await new Promise<number[]>((resolve, reject) => {
        resolve(<number[]>ids);
        reject("Error getting role ids for user.");
      });
    }
  }
