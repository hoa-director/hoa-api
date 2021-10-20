import { DataTypes, Model } from 'sequelize';
import * as uuid from 'uuid';

export class ForgottenPasswordToken extends Model {
  id: number;
  userId: number;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  public static initialize(sequelize) {
    ForgottenPasswordToken.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          unique: true,
          autoIncrement: true,
          field: 'id',
        },
        userId: {
          type: DataTypes.INTEGER,
          field: 'user_id',
        },
        token: {
          type: DataTypes.STRING(100),
          field: 'token',
        }
      },
      { sequelize, tableName: 'forgotten_password_tokens' },
    );
    ForgottenPasswordToken.beforeCreate((forgottenPasswordToken, options) => {
      const token = uuid();
      forgottenPasswordToken.token = token;
    });
  }

  public static asscociate(model) {}
}

export const ForgottenPasswordTokenSchema = ForgottenPasswordToken;
export default ForgottenPasswordToken;
