import * as Bluebird from 'bluebird';
import {
  BelongsToCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  DataTypes,
  HasManyGetAssociationsMixin,
  Model,
} from 'sequelize';
import { Association } from './association';
import { User } from './user';
import { Vote } from './vote';

export class Objection extends Model {
  id: number;
  associationId: number;
  comment: string;
  // submittedBy: number;
  // submittedAgainst: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  closedAt: Date;

  // mixins for association (optional)
  submittedById: number;
  submittedBy: User;
  getSubmittedBy: BelongsToGetAssociationMixin<User>;
  setSubmittedBy: BelongsToSetAssociationMixin<User, number>;
  createSubmittedBy: BelongsToCreateAssociationMixin<User>;

  submittedAgainstId: number;
  submittedAgainst: User;
  getSubmittedAgainst: BelongsToGetAssociationMixin<User>;
  setSubmittedAgainst: BelongsToSetAssociationMixin<User, number>;
  createSubmittedAgainst: BelongsToCreateAssociationMixin<User>;

  getVotes: HasManyGetAssociationsMixin<Vote>;

  public static initialize(sequelize) {
    Objection.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          unique: true,
          autoIncrement: true,
          field: 'id',
        },
        associationId: {
          type: DataTypes.INTEGER,
          field: 'association_id',
        },
        comment: {
          type: DataTypes.STRING(500),
          field: 'comment',
        },
        submittedByUserId: {
          type: DataTypes.INTEGER,
          field: 'submitted_by_user_id',
        },
        submittedAgainstUserId: {
          type: DataTypes.INTEGER,
          field: 'submitted_against_user_id',
        },
        closedAt: {
          type: DataTypes.DATE,
          field: 'closed_at',
        }
      },
      { sequelize, tableName: 'objections' },
    );
  }

  public static asscociate(model) {}

  public static getOpenByAssociationId(associationId): Bluebird<Objection[]> {
    return Association.findByPk(associationId).then((association) => {
      return Objection.findAll({
        where: {
          associationId,
        },
      }).then((objections) => {
        console.log(objections);
        return objections;
      });
    });
  }

  public hasUserVoted(userId) {
    this.getVotes({ where: { userId } }).then((votes) => {
      console.log(votes);
    });
  }

  public getResults() {
    return this.getVotes().then((votes) => {
      let votesFor = 0;
      let votesAgainst = 0;
      votes.map((vote) => {
        if (vote.approved) {
          votesFor += 1;
        } else {
          votesAgainst += 1;
        }
      });
      return {
        passed: votesFor > votesAgainst,
        votesFor,
        votesAgainst,
      };
    });
  }

  public userCanVote(user: User): Bluebird<boolean> {
    console.log(this);
    // If the objection is closed then it can no longer be voted on
    if (this.closedAt) {
      return Bluebird.resolve(false);
    }
    return this.getVotes({
      where: {
        userId: user.id,
      },
    })
      .then((votes) => {
        return !!votes.length;
      })
      .then((hasVoted) => {
        if (hasVoted) {
          return false;
        }

        return user.isInAssociation(this.associationId);
      });
  }
}

export const ObjectionSchema = Objection;
export default ObjectionSchema;
