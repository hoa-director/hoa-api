import * as Bluebird from 'bluebird';
import * as moment from 'moment';
import {
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  Model,
  Op,
} from 'sequelize';

import { Objection } from './objection';
import { Rule } from './rule';
import { RuleList } from './rule-list';
import { Unit } from './unit';
import { User } from './user';
import { Vote } from './vote';

export class Association extends Model {
  id: number;
  name: string;
  objectionVoteTime: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  ruleLists: RuleList[];

  objectionId: number;
  objections: Objection[];
  getObjections: HasManyGetAssociationsMixin<Objection>;
  addObjection: HasManyAddAssociationMixin<Objection, number>;
  createObjection: HasManyCreateAssociationMixin<Objection>;

  units: Unit[];
  users: User[];

  public static getDirectoryByAssociationId(associationId: number) {
    return new Promise((resolve, reject) => {
      Association.findOne({
        where: { id: associationId },
        attributes: ['name'],
        include: [
          {
            model: Unit,
            as: 'units',
            attributes: [
              'addressLineOne',
              'addressLineTwo',
              'city',
              'state',
              'zip',
            ],
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['firstName', 'lastName', 'email', 'number'],
              },
            ],
          },
        ],
      })
        .then((association) => {
          resolve(association);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public static findAllWithUserEmails(): Bluebird<Association[]> {
    return Association.findAll({
      include: [
        {
          model: Unit,
          as: 'units',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['email'],
            },
          ],
        },
      ],
    }).then((associations) => {
      associations.map((association) => {
        const users = association.units.map((unit) => {
          return unit.user;
        });
        association.users = users;
      });
      return associations;
    });
  }

  public static getUsersByAssociationId(
    associationId: number,
  ): Bluebird<User[]> {
    return Association.findOne({
      where: { id: associationId },
      include: [
        {
          model: Unit,
          as: 'units',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['email'],
            },
          ],
        },
      ],
    }).then((association) => {
      const users = association.units.map((unit) => {
        return unit.user;
      });
      return users;
    });
  }

  public static getRuleListsByAssociationId(associationId: number) {
    return new Promise((resolve, reject) => {
      Association.findOne({
        where: { id: associationId },
        attributes: ['name'],
        include: [
          {
            model: RuleList,
            as: 'ruleLists',
            attributes: ['title', 'description'],
            include: [
              {
                model: Rule,
                as: 'rules',
                attributes: ['description'],
              },
            ],
          },
        ],
      })
        .then((association) => {
          resolve(association.ruleLists);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public static initialize(sequelize) {
    Association.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          unique: true,
          autoIncrement: true,
          field: 'id',
        },
        name: {
          type: DataTypes.STRING(45),
          field: 'name',
        },
        objectionVoteTime: {
          type: DataTypes.INTEGER,
          field: 'objection_vote_time',
        },
      },
      { sequelize, tableName: 'associations' },
    );
  }

  public static asscociate(model) {}

  /**
   * @returns {Bluebird<Objection[]>} activeObjections
   */
  public getActiveObjections(): Bluebird<Objection[]> {
    const createdAfter: Date = moment()
      .subtract({ milliseconds: this.objectionVoteTime })
      .toDate();
    return this.getObjections({
      where: { createdAt: { [Op.gt]: createdAfter } },
      attributes: ['id', 'comment', 'createdAt'],
      include: [
        {
          model: User,
          as: 'submittedBy',
          attributes: ['firstName', 'lastName'],
        },
        {
          model: User,
          as: 'submittedAgainst',
          attributes: ['firstName', 'lastName'],
        },
      ],
    }).then((active) => {
      console.log(active);
      return active;
    });
  }
  /**
   * @returns {Bluebird<Objection[]>} activeObjections
   */
  public getUserInbox(userId: number): Bluebird<Objection[]> {
    const createdAfter: Date = moment()
      .subtract({ milliseconds: this.objectionVoteTime })
      .toDate();
    return this.getObjections({
      where: {
        createdAt: { [Op.gt]: createdAfter },
        submittedByUserId: { [Op.ne]: userId },
      },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'comment', 'createdAt'],
      include: [
        {
          model: User,
          as: 'submittedByUser',
          attributes: ['id'],
          include: [
            {
              model: Unit,
              as: 'units',
              where: { associationId: this.id },
              attributes: ['addressLineOne'],
            },
          ],
        },
        {
          model: User,
          as: 'submittedAgainstUser',
          attributes: ['id'],
          include: [
            {
              model: Unit,
              as: 'units',
              where: { associationId: this.id },
              attributes: ['addressLineOne'],
            },
          ],
        },
      ],
    });
  }
  /**
   * @returns {Bluebird<Objection[]>} activeObjections
   */
  public getUserOutbox(userId: number): Bluebird<Objection[]> {
    return this.getObjections({
      where: {
        submittedByUserId: userId,
      },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'comment', 'createdAt'],
      include: [
        {
          model: User,
          as: 'submittedByUser',
          attributes: ['id'],
          include: [
            {
              model: Unit,
              as: 'units',
              where: { associationId: this.id },
              attributes: ['addressLineOne'],
            },
          ],
        },
        {
          model: User,
          as: 'submittedAgainstUser',
          attributes: ['id'],
          include: [
            {
              model: Unit,
              as: 'units',
              where: { associationId: this.id },
              attributes: ['addressLineOne'],
            },
          ],
        },
      ],
    });
  }

  /**
   * @returns {Bluebird<Objection[]>}
   */
  public getPastObjections(): Bluebird<Objection[]> {
    return this.getObjections({
      where: {
        /* tslint:disable-next-line:no-null-keyword */
        closedAt: { [Op.ne]: null },
      },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'comment', 'createdAt'],
      include: [
        {
          model: User,
          as: 'submittedByUser',
          attributes: ['id'],
          include: [
            {
              model: Unit,
              as: 'units',
              where: { associationId: this.id },
              attributes: ['addressLineOne'],
            },
          ],
        },
        {
          model: User,
          as: 'submittedAgainstUser',
          attributes: ['id'],
          include: [
            {
              model: Unit,
              as: 'units',
              where: { associationId: this.id },
              attributes: ['addressLineOne'],
            },
          ],
        },
      ],
    });
  }

  /**
   * @returns {Bluebird<Objection[]>}
   */
  public getExpiredObjections(): Bluebird<Objection[]> {
    const createdBefore: number = moment()
      .subtract({ milliseconds: this.objectionVoteTime })
      .valueOf();
    return this.getObjections({
      where: {
        createdAt: { [Op.lt]: createdBefore },
        /* tslint:disable-next-line:no-null-keyword */
        closedAt: null,
      },
      attributes: ['id', 'comment', 'createdAt'],
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName'],
          as: 'submittedBy',
        },
        {
          model: User,
          attributes: ['firstName', 'lastName'],
          as: 'submittedAgainst',
        },
      ],
    });
  }

  public getUsers(): Bluebird<User[]> {
    return Association.findOne({
      where: { id: this.id },
      include: [
        {
          model: Unit,
          as: 'units',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['email'],
            },
          ],
        },
      ],
    }).then((association) => {
      const users = association.units.map((unit) => {
        return unit.user;
      });
      return users;
    });
  }
}

export const AssociationSchema = Association;
export default AssociationSchema;
