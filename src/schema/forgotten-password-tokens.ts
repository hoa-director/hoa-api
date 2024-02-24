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
import { v4 as uuidv4 } from 'uuid';
import User from './user';

export class ForgottenPasswordToken extends Model<InferAttributes<ForgottenPasswordToken>, InferCreationAttributes<ForgottenPasswordToken>> {
  declare userId: ForeignKey<User["id"]>;
  declare token: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: Date | null;

  public static initialize(sequelize: any) {
    ForgottenPasswordToken.init(
      {
        userId: {
          type: DataTypes.INTEGER,
        },
        token: {
          type: new DataTypes.STRING(100),
          allowNull: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: { 
          type: DataTypes.DATE, 
          allowNull: true },
      },
      { sequelize },
    );
    
    ForgottenPasswordToken.beforeCreate((forgottenPasswordToken, options) => {
      const token = uuidv4();
      forgottenPasswordToken.token = token;
    });
  }
}

export const ForgottenPasswordTokenSchema = ForgottenPasswordToken;
export default ForgottenPasswordToken;
