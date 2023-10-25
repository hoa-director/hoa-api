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
import bcrypt from "bcrypt";
import { roles } from "../config/roles.js";
import { HomeOwnerAssociation } from "./home-owner-association.js";
import { ForgottenPasswordToken } from "./forgotten-password-tokens.js";

const saltWorkFactor = 10;

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare password: string; // TODO: Make private
  declare phone: number;
  declare role: number | null;
  declare firstName: string;
  declare lastName: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: Date | null

  declare getAssociations: HasManyGetAssociationsMixin<HomeOwnerAssociation>;

  public static encryptPassword(password: string) {
    const salt = bcrypt.genSaltSync(saltWorkFactor);
    return bcrypt.hashSync(password, salt);
  }

  public static findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  public static initialize(sequelize: any) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          unique: true,
          autoIncrement: true,
        },
        email: {
          type: new DataTypes.STRING,
          validate: {
            max: 100,
            isEmail: true
          },
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          validate: {
            max: 45
          },
        },
        phone: {
          type: new DataTypes.STRING(12),
          allowNull: false
        },
        role: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        firstName: {
          type: new DataTypes.STRING,
          allowNull: false
        },
        lastName: {
          type: new DataTypes.STRING,
          allowNull: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: { 
          type: DataTypes.DATE, 
          allowNull: true },
      },
      { 
        sequelize
      }
    );
    User.beforeCreate((user, options) => {
      console.log(user);
      const encryptedPassword = User.encryptPassword(user.password);
      user.password = encryptedPassword;
    });
  }

  public getAvailableAssociations(): Promise<HomeOwnerAssociation[]> {
    const includedAttributes = ["id", "name"];
    if (this.role === roles.ADMIN) {
      return HomeOwnerAssociation.findAll({
        attributes: includedAttributes
      });
    }
    return this.getAssociations({
      attributes: includedAttributes
    });
  }

  public comparePassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }

  public changePassword(password: string) {
    this.password = User.encryptPassword(password);
    return this.save();
  }

  public isInAssociation(hoaId: number): Promise<boolean> {
    return this.getAssociations({
      where: {
        id: hoaId
      }
    }).then(associations => {
      return !!associations.length;
    });
  }
}

export const UserSchema = User;
export default User;
