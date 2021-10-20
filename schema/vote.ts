import { DataTypes, Model } from "sequelize";
import { DuplicateError } from "../classes/duplicate-error";

export class Vote extends Model {
  id: number;
  userId: number;
  objectionId: number;
  anonymous: boolean;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  public static initialize(sequelize) {
    Vote.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          unique: true,
          autoIncrement: true,
          field: "id"
        },
        userId: {
          type: DataTypes.INTEGER,
          field: "user_id"
        },
        objectionId: {
          type: DataTypes.INTEGER,
          field: "objection_id"
        },
        anonymous: {
          type: DataTypes.BOOLEAN,
          field: "anonymous"
        },
        approved: {
          type: DataTypes.BOOLEAN,
          field: "approved"
        }
      },
      { sequelize, tableName: "votes" }
    );
    Vote.beforeValidate(async (vote, options) => {
      return await Objection.findOne({
        where: { id: vote.objectionId },
        include: [{ model: Association, as: "association" }]
      }).then(async objection => {
        await objection.getVotes().then(async votes => {
          // User has already voted. Cancel creation
          if (votes.length) {
            return Promise.reject(new DuplicateError("Duplicate entry"));
          }
        });
      });
    });
  }

  public static asscociate(model) {}
}

import { Association } from "./association";
import { Objection } from "./objection";

export const VoteSchema = Vote;
export default VoteSchema;
