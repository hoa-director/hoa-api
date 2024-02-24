// import {
//   DataTypes,
//   HasManyAddAssociationMixin,
//   HasManyCreateAssociationMixin,
//   HasManyGetAssociationsMixin,
//   Model,
//   InferAttributes,
//   InferCreationAttributes,
//   Op,
//   CreationOptional,
//   Sequelize,
//   ForeignKey,
// } from "sequelize";
// import { RuleList } from "./rule-list";
// import { CreateContextOptions } from "vm";

// export class Rule extends Model<
//   InferAttributes<Rule>,
//   InferCreationAttributes<Rule>
// > {
//   declare id: CreationOptional<number>;
//   declare ruleListId: ForeignKey<RuleList["id"]>;
//   declare description: string;
//   declare createdAt: CreationOptional<Date>;
//   declare updatedAt: CreationOptional<Date>;
//   declare deletedAt: Date | null;

//   public static initialize(sequelize: any) {
//     Rule.init(
//       {
//         id: {
//           type: DataTypes.INTEGER,
//           primaryKey: true,
//           unique: true,
//           autoIncrement: true,
//         },
//         ruleListId: {
//           type: DataTypes.INTEGER,
//         },
//         description: {
//           type: new DataTypes.STRING(500),
//           allowNull: false,
//         },
//         createdAt: DataTypes.DATE,
//         updatedAt: DataTypes.DATE,
//         deletedAt: { 
//           type: DataTypes.DATE, 
//           allowNull: true },
//       },
//       { sequelize }
//     );
//   }
// }

// export const RuleSchema = Rule;
// export default RuleSchema;
