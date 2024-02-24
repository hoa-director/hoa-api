// import moment from 'moment';
import {
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Op,
  CreationOptional,
  Sequelize,
  NonAttribute,
} from 'sequelize';

// import { Objection } from './objection';
// import { Rule } from './rule';
// import { RuleList } from './rule-list';
// import { Unit } from './unit';
// import { User } from './user';
// import { Vote } from './vote';
// import { Error } from "sequelize";
// import { Primitive } from "sequelize/types/utils";
// import { resolve } from "path";

export class HomeOwnerAssociation extends Model<
  InferAttributes<HomeOwnerAssociation>,
  InferCreationAttributes<HomeOwnerAssociation>
> {
  declare id: CreationOptional<number>;
  declare name: string;
//   declare objectionVoteTime: number; TODO: separate table for association voting time
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: Date | null;

//   declare ruleLists: NonAttribute<RuleList[]>;

//   declare objectionId: NonAttribute<number>;
//   declare objections: NonAttribute<Objection[]>;
//   declare getObjections: HasManyGetAssociationsMixin<Objection>;
//   declare addObjection: HasManyAddAssociationMixin<Objection, number>;
//   declare createObjection: HasManyCreateAssociationMixin<Objection>;

//   declare units: NonAttribute<Unit[]>;
//   declare users: NonAttribute<User[]>;

public static initialize(sequelize: any) {
  HomeOwnerAssociation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      name: {
        type: new DataTypes.STRING(45),
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { sequelize }
  );
}

//   public static async getDirectoryByhoaId(
//     hoaId: number
//   ) : Promise<HomeOwnerAssociation | null> {
//     return await HomeOwnerAssociation.findOne({
//       where: { id: hoaId },
//       attributes: ["name"],
//       include: [
//         {
//           model: Unit,
//           attributes: [
//             "addressLineOne",
//             "addressLineTwo",
//             "city",
//             "state",
//             "zip",
//           ],
//           include: [
//             {
//               model: User,
//               attributes: ["firstName", "lastName", "email", "number"],
//             },
//           ],
//         },
//       ],
//     })
//   }

//   public static findAllWithUserEmails() {
//     return new Promise((resolve, reject) => {
//     HomeOwnerAssociation.findAll({
//       include: [
//         {
//           model: Unit,
//           include: [
//             {
//               model: User,
//               attributes: ["email"],
//             },
//           ],
//         },
//       ],
//     }).then((associations) => {
//       associations.map((association) => {
//         const users = association.units.map((unit: { user: User; }) => {
//           return unit.user;
//         });
//         association.users = users;
//       });
//       resolve(associations);
//     })
//     .catch((error) => {
//       reject(error);
//     });
//   });
//   }

//   public static getUsersByHoaId(
//     hoaId: number
//   ) {
//     return new Promise((resolve, reject) => {
//     HomeOwnerAssociation.findOne({
//       where: { id: hoaId },
//       include: [
//         {
//           model: Unit,
//           include: [
//             {
//               model: User,
//               attributes: ["email"],
//             },
//           ],
//         },
//       ],
//     }).then((association: any) => {
//       const users = association?.units.map((unit: { user: User; }) => {
//         return unit.user;
//       });
//       return users as User[];
//     }) 
//     .catch((error) => {
//       reject(error);
//     });
//   });
//   }

//   public static getRuleListsByhoaId(hoaId: number
//     ) {
//       return new Promise((resolve, reject) => {
//       HomeOwnerAssociation.findOne({
//         where: { id: hoaId },
//         attributes: ["name"],
//         include: [
//           {
//             model: RuleList,
//             attributes: ["title", "description"],
//             include: [
//               {
//                 model: Rule,
//                 attributes: ["description"],
//               },
//             ],
//           },
//         ],
//       }).then((association: any) => {
//           resolve(association.ruleLists);
//         })  
//         .catch((error) => {
//           reject(error);
//         });
//       });
//   } 

//   /**
//    * @returns {Promise<Objection[]>} activeObjections
//    */
//   public getActiveObjections(): Promise<Objection[]> {
//     const createdAfter: Date = moment()
//       .subtract({ milliseconds: this.objectionVoteTime })
//       .toDate();
//     return this.getObjections({
//       where: { createdAt: { [Op.gt]: createdAfter } },
//       attributes: ["id", "comment", "createdAt"],
//       include: [
//         {
//           model: User,
//           attributes: ["firstName", "lastName"],
//         },
//         {
//           model: User,
//           attributes: ["firstName", "lastName"],
//         },
//       ],
//     }).then((active) => {
//       console.log(active);
//       return active;
//     });
//   }
//   /**
//    * @returns {Promise<Objection[]>} activeObjections
//    */
//   public getUserInbox(userId: number): Promise<Objection[]> {
//     const createdAfter: Date = moment()
//       .subtract({ milliseconds: this.objectionVoteTime })
//       .toDate();
//     return this.getObjections({
//       where: {
//         createdAt: { [Op.gt]: createdAfter },
//         submittedByUserId: { [Op.ne]: userId },
//       },
//       order: [["createdAt", "DESC"]],
//       attributes: ["id", "comment", "createdAt"],
//       include: [
//         {
//           model: User,
//           attributes: ["id"],
//           include: [
//             {
//               model: Unit,
//               where: { hoaId: this.id },
//               attributes: ["addressLineOne"],
//             },
//           ],
//         },
//         {
//           model: User,
//           attributes: ["id"],
//           include: [
//             {
//               model: Unit,
//               where: { hoaId: this.id },
//               attributes: ["addressLineOne"],
//             },
//           ],
//         },
//       ],
//     });
//   }
//   /**
//    * @returns {Promise<Objection[]>} activeObjections
//    */
//   public getUserOutbox(userId: number): Promise<Objection[]> {
//     return this.getObjections({
//       where: {
//         submittedByUserId: userId,
//       },
//       order: [["createdAt", "DESC"]],
//       attributes: ["id", "comment", "createdAt"],
//       include: [
//         {
//           model: User,
//           attributes: ["id"],
//           include: [
//             {
//               model: Unit,
//               where: { hoaId: this.id },
//               attributes: ["addressLineOne"],
//             },
//           ],
//         },
//         {
//           model: User,
//           attributes: ["id"],
//           include: [
//             {
//               model: Unit,
//               where: { hoaId: this.id },
//               attributes: ["addressLineOne"],
//             },
//           ],
//         },
//       ],
//     });
//   }

//   /**
//    * @returns {Promise<Objection[]>}
//    */
//   public getPastObjections(): Promise<Objection[]> {
//     return this.getObjections({
//       where: {
//         /* tslint:disable-next-line:no-null-keyword */
//         closedAt: { [Op.ne]: null },
//       },
//       order: [["createdAt", "DESC"]],
//       attributes: ["id", "comment", "createdAt"],
//       include: [
//         {
//           model: User,
//           attributes: ["id"],
//           include: [
//             {
//               model: Unit,
//               where: { hoaId: this.id },
//               attributes: ["addressLineOne"],
//             },
//           ],
//         },
//         {
//           model: User,
//           attributes: ["id"],
//           include: [
//             {
//               model: Unit,
//               where: { hoaId: this.id },
//               attributes: ["addressLineOne"],
//             },
//           ],
//         },
//       ],
//     });
//   }

//   /**
//    * @returns {Promise<Objection[]>}
//    */
//   public getExpiredObjections(): Promise<Objection[]> {
//     const createdBefore: number = moment()
//       .subtract({ milliseconds: this.objectionVoteTime })
//       .valueOf();
//     return this.getObjections({
//       where: {
//         createdAt: { [Op.lt]: createdBefore },
//         /* tslint:disable-next-line:no-null-keyword */
//         closedAt: null,
//       },
//       attributes: ["id", "comment", "createdAt"],
//       include: [
//         {
//           model: User,
//           attributes: ["firstName", "lastName"],
//         },
//         {
//           model: User,
//           attributes: ["firstName", "lastName"],
//         },
//       ],
//     });
//   }

//   public getUsers(): Promise<any [] | User[] | undefined> {
//     return HomeOwnerAssociation.findOne({
//       where: { id: this.id },
//       include: [
//         {
//           model: Unit,
//           include: [
//             {
//               model: User,
//               attributes: ["email"],
//             },
//           ],
//         },
//       ],
//     }).then((association) => {
//       const users = association?.units.map((unit) => {
//         return unit.user;
//       });
//       return users;
//     });
//   }
}

export const HomeOwnerAssociationSchema = HomeOwnerAssociation;
export default HomeOwnerAssociationSchema;
