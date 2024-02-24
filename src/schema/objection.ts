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
//   BelongsToGetAssociationMixin,
//   BelongsToSetAssociationMixin,
//   BelongsToCreateAssociationMixin,
// } from 'sequelize';
// import { HomeOwnerAssociation } from './home-owner-association';
// import { User } from './user';
// import { Vote } from './vote';

// export class Objection extends Model<InferAttributes<Objection>, InferCreationAttributes<Objection>> {
//   declare id: CreationOptional<number>;
//   declare hoaId: ForeignKey<HomeOwnerAssociation["id"]>;;
//   declare comment: string;
//   // declare submittedBy: number;
//   // declare submittedAgainst: number;
//   declare createdAt: CreationOptional<Date>;
//   declare updatedAt: CreationOptional<Date>;
//   declare deletedAt: Date | null;
//   declare closedAt: Date | null;

//   // mixins for association (optional)
//   declare submittedById: number;
//   declare submittedBy: User;
//   declare getSubmittedBy: BelongsToGetAssociationMixin<User>;
//   declare setSubmittedBy: BelongsToSetAssociationMixin<User, number>;
//   declare createSubmittedBy: BelongsToCreateAssociationMixin<User>;

//   declare submittedAgainstId: number;
//   declare submittedAgainst: User;
//   declare getSubmittedAgainst: BelongsToGetAssociationMixin<User>;
//   declare setSubmittedAgainst: BelongsToSetAssociationMixin<User, number>;
//   declare createSubmittedAgainst: BelongsToCreateAssociationMixin<User>;

//   declare getVotes: HasManyGetAssociationsMixin<Vote>;

//   public static initialize(sequelize: any) {
//     Objection.init(
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
//         comment: {
//           type: new DataTypes.STRING(500),
//           allowNull: false
//         },
//         submittedById: {
//           type: DataTypes.INTEGER,
//         },
//         submittedAgainstId: {
//           type: DataTypes.INTEGER,
//         },
//         closedAt: {
//           type: DataTypes.DATE,
//         },
//         submittedBy: '',
//         submittedAgainst: '',
//         createdAt: DataTypes.DATE,
//         updatedAt: DataTypes.DATE,
//         deletedAt: { 
//           type: DataTypes.DATE, 
//           allowNull: true },
//       },
//       { sequelize },
//     );
//   }

//   public static async getOpenByhoaId(hoaId: number): Promise<Objection[]> {
//     // TODO: Is this needed?
//     const association = await HomeOwnerAssociation.findByPk(hoaId);
    
//     return await Objection.findAll({
//         where: {
//           hoaId,
//         },
//       }).then((objections) => {
//         console.log(objections);
//         return objections;
//       });
//   }

//   public hasUserVoted(userId: number) {
//     this.getVotes({ where: { userId } }).then((votes) => {
//       console.log(votes);
//     });
//   }

//   public getResults() {
//     return this.getVotes().then((votes) => {
//       let votesFor = 0;
//       let votesAgainst = 0;
//       votes.map((vote) => {
//         if (vote.approved) {
//           votesFor += 1;
//         } else {
//           votesAgainst += 1;
//         }
//       });
//       return {
//         passed: votesFor > votesAgainst,
//         votesFor,
//         votesAgainst,
//       };
//     });
//   }

//   public userCanVote(user: User): Promise<boolean> {
//     console.log(this);
//     // If the objection is closed then it can no longer be voted on
//     if (this.closedAt) {
//       return Promise.resolve(false);
//     }
//     return this.getVotes({
//       where: {
//         userId: user.id,
//       },
//     })
//       .then((votes) => {
//         return !!votes.length;
//       })
//       .then((hasVoted) => {
//         if (hasVoted) {
//           return false;
//         }

//         return user.isInAssociation(+this.hoaId);
//       });
//   }
// }

// export const ObjectionSchema = Objection;
// export default ObjectionSchema;
