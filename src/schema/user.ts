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
import { ROLES } from "../config/roles";
// import { HomeOwnerAssociation } from "./home-owner-association";
import { ForgottenPasswordToken } from "./forgotten-password-tokens";
import { SystemRole } from './system-role';
import { HomeOwnerAssociation } from './home-owner-association';

const saltWorkFactor = 10;

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare password: string; // TODO: Make private
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: Date | null

  declare getAssociations: HasManyGetAssociationsMixin<HomeOwnerAssociation>;

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

  public static encryptPassword(password: string) {
    const salt = bcrypt.genSaltSync(saltWorkFactor);
    return bcrypt.hashSync(password, salt);
  }

  public static findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  public getAvailableAssociations(): Promise<HomeOwnerAssociation[] | undefined> {

    const includedAttributes = ["id", "name"];
    
    return SystemRole.findAllRolesForUser(this.id)
    .then((roleIds) => {
      if (roleIds.includes(ROLES.SUPER_ADMIN)) {
        return HomeOwnerAssociation.findAll({
          attributes: includedAttributes
        });
      }
    });
  }

  public comparePassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }

  public changePassword(password: string) {
    this.password = User.encryptPassword(password);
    return this.save();
  }

  // public isInAssociation(hoaId: number): Promise<boolean> {
  //   return this.getAssociations({
  //     where: {
  //       id: hoaId
  //     }
  //   }).then(associations => {
  //     return !!associations.length;
  //   });
  // }
}

export const UserSchema = User;
export default User;
