import * as Sequelize from 'sequelize';

export class Rule extends Sequelize.Model {
  id: number;
  ruleListId: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  public static initialize(sequelize) {
    Rule.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          unique: true,
          autoIncrement: true,
          field: 'id',
        },
        ruleListId: {
          type: Sequelize.INTEGER,
          field: 'rule_list_id',
        },
        description: {
          type: Sequelize.STRING(500),
          field: 'description',
        },
      },
      { sequelize, tableName: 'rules' },
    );
  }

  public static asscociate(model) {}
}

export const RuleSchema = Rule;
export default RuleSchema;
