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
          type: DataTypes.INTEGER({ length: 10 }),
          primaryKey: true,
          unique: true,
          autoIncrement: true,
          field: 'id',
        },
        userId: {
          type: DataTypes.INTEGER({ length: 10 }),
          field: 'user_id',
        },
        token: {
          type: DataTypes.STRING(100),
          field: 'token',
        },
        createdAt: {
          type: DataTypes.DATE,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          field: 'updated_at',
        },
        deletedAt: {
          type: DataTypes.DATE,
          field: 'deleted_at',
        },
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
