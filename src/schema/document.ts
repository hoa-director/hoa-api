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
//   NonAttribute,
//   ForeignKey,
// } from 'sequelize';
// import { HomeOwnerAssociation } from './home-owner-association';

// export class Document extends Model<InferAttributes<Document>, InferCreationAttributes<Document>>  {
//   declare id: CreationOptional<number>;
//   declare hoaId: ForeignKey<HomeOwnerAssociation["id"]>;
//   declare path: string;
//   declare name: string;
//   declare createdAt: CreationOptional<Date>;
//   declare updatedAt: CreationOptional<Date>;
//   declare deletedAt: Date | null;

//   public static async getDocumentsByAssociation(hoaId: number): Promise<Document[]> {
//     return await Document.findAll({ where: { hoaId } })
//   }

//   public static async getDocumentByAssociationAndId(hoaId: number, documentId: number) {
//     return await Document.findOne({ where: { hoaId, id: documentId } })
//   }

//   public static initialize(sequelize: any) {
//     Document.init(
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
//         path: {
//           type: new DataTypes.STRING(100),
//           allowNull: false
//         },
//         name: {
//           type: new DataTypes.STRING(45),
//           allowNull: false
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

// export const DocumentSchema = Document;
// export default DocumentSchema;
