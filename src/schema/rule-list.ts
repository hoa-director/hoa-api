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
// } from 'sequelize';
// import { HomeOwnerAssociation } from './home-owner-association';

// export class RuleList extends Model<InferAttributes<RuleList>,
// InferCreationAttributes<RuleList>> {
//   declare id: CreationOptional<number>;
//   declare hoaId: ForeignKey<HomeOwnerAssociation["id"]>;
//   declare title: string;
//   declare description: string;
//   declare createdAt: CreationOptional<Date>;
//   declare updatedAt: CreationOptional<Date>;
//   declare deletedAt: Date | null

//   public static initialize(sequelize: any) {
//     RuleList.init(
//       {
//         id: {
//           type: DataTypes.INTEGER,
//           primaryKey: true,
//           unique: true,
//           autoIncrement: true,
//         },
//         hoaId: {
//           type: DataTypes.INTEGER,
//         },
//         title: {
//           type: new DataTypes.STRING(100),
//           allowNull: false
//         },
//         description: {
//           type: new DataTypes.STRING(1000),
//           allowNull: false
//         },
//         createdAt: DataTypes.DATE,
//         updatedAt: DataTypes.DATE,
//         deletedAt: { 
//           type: DataTypes.DATE, 
//           allowNull: true },
//       },
//       { sequelize },
//     );
//   }
// }

// export const RuleListSchema = RuleList;
// export default RuleListSchema;
