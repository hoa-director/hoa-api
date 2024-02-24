// import { CreationOptional, DataTypes, ForeignKey, Model } from "sequelize";
// import { DuplicateError } from "../classes/duplicate-error";
// import { HomeOwnerAssociation } from "./home-owner-association";
// import { Objection } from "./objection";
// import { User } from "./user";

// export class Vote extends Model {
//   declare id: CreationOptional<number>;
//   declare userId: ForeignKey<User["id"]>;
//   declare objectionId: ForeignKey<Objection["id"]>;
//   declare anonymous: boolean;
//   declare approved: boolean;
//   declare createdAt: CreationOptional<Date>;
//   declare updatedAt: CreationOptional<Date>;
//   declare deletedAt: Date | null;

//   public static initialize(sequelize: any) {
//     Vote.init(
//       {
//         id: {
//           type: DataTypes.INTEGER,
//           primaryKey: true,
//           unique: true,
//           autoIncrement: true,
//         },
//         userId: {
//           type: DataTypes.INTEGER,
//         },
//         objectionId: {
//           type: DataTypes.INTEGER,
//         },
//         anonymous: {
//           type: DataTypes.BOOLEAN,
//         },
//         approved: {
//           type: DataTypes.BOOLEAN,
//         }
//       },
//       { sequelize }
//     );
//     Vote.beforeValidate(async (vote, options) => {
//       return await Objection.findOne({
//         where: { id: vote.objectionId },
//         include: [{ model: HomeOwnerAssociation }]
//       }).then(async objection => {
//         await objection?.getVotes().then(async votes => {
//           // User has already voted. Cancel creation
//           if (votes.length) {
//             return Promise.reject(new DuplicateError("Duplicate entry"));
//           }
//         });
//       });
//     });
//   }
// }

// export const VoteSchema = Vote;
// export default VoteSchema;
