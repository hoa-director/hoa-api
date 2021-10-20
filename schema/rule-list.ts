import * as Sequelize from 'sequelize';

export class RuleList extends Sequelize.Model {
  id: number;
  associationId: number;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  public static initialize(sequelize) {
    RuleList.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          unique: true,
          autoIncrement: true,
          field: 'id',
        },
        associationId: {
          type: Sequelize.INTEGER,
          field: 'association_id',
        },
        title: {
          type: Sequelize.STRING(100),
          field: 'title',
        },
        description: {
          type: Sequelize.STRING(1000),
          field: 'description',
        },
      },
      { sequelize, tableName: 'rule_lists' },
    );
  }

  public static asscociate(model) {}
}

export const RuleListSchema = RuleList;
export default RuleListSchema;
