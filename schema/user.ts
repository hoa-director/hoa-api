import * as bcrypt from "bcrypt";
import * as Bluebird from "bluebird";
import { DataTypes, HasManyGetAssociationsMixin, Model } from "sequelize";
import { roles } from "../config/roles";
import { Association } from "./association";
import { ForgottenPasswordToken } from "./forgotten-password-tokens";

const saltWorkFactor = 10;

export class User extends Model {
  id: number;
  email: string;
  private password: string;
  number: number;
  role: number;
  firstName: string;
  lastName: string;
  // fullName: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  tokens: ForgottenPasswordToken[];

  getAssociations: HasManyGetAssociationsMixin<Association>;

  public static encryptPassword(password: string) {
    const salt = bcrypt.genSaltSync(saltWorkFactor);
    return bcrypt.hashSync(password, salt);
  }

  public static findByEmail(email: string): Bluebird<User> {
    return User.findOne({ where: { email } });
  }

  public static initialize(sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER({ length: 10 }),
          primaryKey: true,
          unique: true,
          autoIncrement: true,
          field: "id"
        },
        email: {
          type: DataTypes.STRING(100),
          validate: {
            max: 100,
            isEmail: true
          },
          unique: true,
          field: "email"
        },
        password: {
          type: DataTypes.STRING(45),
          validate: {
            max: 45
          },
          field: "password"
        },
        number: {
          type: DataTypes.STRING(12),
          field: "number"
        },
        role: {
          type: DataTypes.INTEGER({ length: 2 }),
          field: "role"
        },
        firstName: {
          type: DataTypes.STRING(45),
          field: "first_name"
        },
        lastName: {
          type: DataTypes.STRING(45),
          field: "last_name"
        },
        // fullName: {
        //     type: DataTypes.STRING(91),
        //     field: 'full_name',
        // },
        createdAt: {
          type: DataTypes.DATE,
          field: "created_at"
        },
        updatedAt: {
          type: DataTypes.DATE,
          field: "updated_at"
        },
        deletedAt: {
          type: DataTypes.DATE,
          field: "deleted_at"
        }
      },
      { sequelize, tableName: "users" }
    );
    User.beforeCreate((user, options) => {
      console.log(user);
      const encryptedPassword = User.encryptPassword(user.password);
      user.password = encryptedPassword;
    });
  }

  public static asscociate(model) {}

  public getAvailableAssociations(): Bluebird<Association[]> {
    const includedAttributes = ["id", "name"];
    if (this.role === roles.ADMIN) {
      return Association.findAll({
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

  public changePassword(password) {
    this.password = User.encryptPassword(password);
    return this.save();
  }

  public isInAssociation(associationId): Bluebird<boolean> {
    return this.getAssociations({
      where: {
        id: associationId
      }
    }).then(associations => {
      return !!associations.length;
    });
  }
}

export const UserSchema = User;
export default User;
