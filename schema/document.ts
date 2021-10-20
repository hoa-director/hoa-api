import * as Sequelize from "sequelize";

export class Document extends Sequelize.Model {
  id: number;
  associationId: number;
  path: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  public static getDocumentsByAssociation(associationId) {
    return new Promise((resolve, reject) => {
      Document.findAll({ where: { associationId } })
        .then((document) => {
          resolve(document);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public static getDocumentByAssociationAndId(associationId, documentId) {
    return new Promise((resolve, reject) => {
      Document.findOne({ where: { associationId, id: documentId } })
        .then((document) => {
          resolve(document);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public static initialize(sequelize) {
    Document.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          unique: true,
          autoIncrement: true,
          field: "id",
        },
        associationId: {
          type: Sequelize.INTEGER,
          field: "association_id",
        },
        path: {
          type: Sequelize.STRING(100),
          field: "path",
        },
        name: {
          type: Sequelize.STRING(45),
          field: "name",
        }
      },
      { sequelize, tableName: "documents" }
    );
  }

  public static asscociate(model) {}
}

export const DocumentSchema = Document;
export default DocumentSchema;
