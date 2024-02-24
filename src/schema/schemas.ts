import { connection } from '../config/database';
import { HomeOwnerAssociationSchema } from './home-owner-association';
// import { DocumentSchema } from './document';
import { ForgottenPasswordTokenSchema } from './forgotten-password-tokens';
// import { ObjectionSchema } from './objection';
// import { RuleSchema } from './rule';
// import { RuleListSchema } from './rule-list';
// import { UnitSchema } from './unit';
import { UserSchema } from './user';
// import { VoteSchema } from './vote';
import { ContactInformation } from './contact-information';
import { SystemRole } from './system-role';
import { HoaRole } from './hoa-role';

HomeOwnerAssociationSchema.initialize(connection);
// DocumentSchema.initialize(connection);
ForgottenPasswordTokenSchema.initialize(connection);
// ObjectionSchema.initialize(connection);
// RuleListSchema.initialize(connection);
// RuleSchema.initialize(connection);
// UnitSchema.initialize(connection);
UserSchema.initialize(connection);
// VoteSchema.initialize(connection);
ContactInformation.initialize(connection);
SystemRole.initialize(connection);
HoaRole.initialize(connection);

// HomeOwnerAssociationSchema.hasMany(UnitSchema);
// HomeOwnerAssociationSchema.hasMany(DocumentSchema);
// HomeOwnerAssociationSchema.hasMany(RuleListSchema);
// HomeOwnerAssociationSchema.hasMany(ObjectionSchema);
// HomeOwnerAssociationSchema.belongsToMany(UserSchema, {
//   through: { model: UnitSchema, unique: false }
// });





// ObjectionSchema.belongsTo(UserSchema, {
//   as: 'submittedByUser',
//   foreignKey: 'submitted_by_user_id',
//   targetKey: 'id',
// });
// ObjectionSchema.belongsTo(UserSchema, {
//   as: 'submittedAgainstUser',
//   foreignKey: 'submitted_against_user_id',
//   targetKey: 'id',
// });
// ObjectionSchema.belongsTo(UnitSchema, {
//     as: 'submittedByUnit',
//     // through: UserSchema,
//     foreignKey: 'submitted_by_unit_id',
//     targetKey: 'id',
// });
// ObjectionSchema.belongsTo(UnitSchema, {
//     as: 'submittedAgainstUnit',
//     // through: UserSchema,
//     foreignKey: 'submitted_against_unit_id',
//     targetKey: 'id',
// });

// ObjectionSchema.belongsTo(HomeOwnerAssociationSchema);
// ObjectionSchema.hasMany(VoteSchema);

// RuleListSchema.hasMany(RuleSchema);

// RuleListSchema.belongsTo(HomeOwnerAssociationSchema);

// RuleSchema.belongsTo(RuleListSchema);

// UnitSchema.belongsTo(UserSchema);
// UnitSchema.belongsTo(HomeOwnerAssociationSchema);

// UserSchema.hasMany(UnitSchema);
// UserSchema.hasMany(VoteSchema);
// UserSchema.hasMany(ObjectionSchema);
// UserSchema.hasMany(ObjectionSchema);
// UserSchema.belongsToMany(HomeOwnerAssociationSchema, {
//   through: { model: UnitSchema, unique: false },
//   as: 'associations',
// });

UserSchema.hasMany(ForgottenPasswordTokenSchema);
ForgottenPasswordTokenSchema.belongsTo(UserSchema);

UserSchema.hasOne(ContactInformation);
ContactInformation.belongsTo(UserSchema);

UserSchema.hasOne(SystemRole);
SystemRole.belongsTo(UserSchema);

UserSchema.hasOne(HoaRole);
HoaRole.belongsTo(UserSchema);

HomeOwnerAssociationSchema.hasOne(HoaRole);
HoaRole.belongsTo(HomeOwnerAssociationSchema);

// VoteSchema.belongsTo(UserSchema);
// VoteSchema.belongsTo(ObjectionSchema);

// export const Association = HomeOwnerAssociationSchema;
// export const Document = DocumentSchema;

export const ForgottenPasswordToken = ForgottenPasswordTokenSchema;
// export const Objection = ObjectionSchema;
// export const RuleList = RuleListSchema;
// export const Rule = RuleSchema;
// export const Unit = UnitSchema;
export const user = UserSchema;
// export const Vote = VoteSchema;
