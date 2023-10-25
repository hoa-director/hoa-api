import { connection } from '../config/database.js';
import { HomeOwnerAssociationSchema } from './home-owner-association.js';
import { DocumentSchema } from './document.js';
import { ForgottenPasswordTokenSchema } from './forgotten-password-tokens.js';
import { ObjectionSchema } from './objection.js';
import { RuleSchema } from './rule.js';
import { RuleListSchema } from './rule-list.js';
import { UnitSchema } from './unit.js';
import { UserSchema } from './user.js';
import { VoteSchema } from './vote.js';

HomeOwnerAssociationSchema.initialize(connection);
DocumentSchema.initialize(connection);
ForgottenPasswordTokenSchema.initialize(connection);
ObjectionSchema.initialize(connection);
RuleListSchema.initialize(connection);
RuleSchema.initialize(connection);
UnitSchema.initialize(connection);
UserSchema.initialize(connection);
VoteSchema.initialize(connection);

HomeOwnerAssociationSchema.hasMany(UnitSchema);
HomeOwnerAssociationSchema.hasMany(DocumentSchema);
HomeOwnerAssociationSchema.hasMany(RuleListSchema);
HomeOwnerAssociationSchema.hasMany(ObjectionSchema);
HomeOwnerAssociationSchema.belongsToMany(UserSchema, {
  through: { model: UnitSchema, unique: false }
});



ForgottenPasswordTokenSchema.belongsTo(UserSchema);

ObjectionSchema.belongsTo(UserSchema, {
  as: 'submittedByUser',
  foreignKey: 'submitted_by_user_id',
  targetKey: 'id',
});
ObjectionSchema.belongsTo(UserSchema, {
  as: 'submittedAgainstUser',
  foreignKey: 'submitted_against_user_id',
  targetKey: 'id',
});
ObjectionSchema.belongsTo(UnitSchema, {
    as: 'submittedByUnit',
    // through: UserSchema,
    foreignKey: 'submitted_by_unit_id',
    targetKey: 'id',
});
ObjectionSchema.belongsTo(UnitSchema, {
    as: 'submittedAgainstUnit',
    // through: UserSchema,
    foreignKey: 'submitted_against_unit_id',
    targetKey: 'id',
});

ObjectionSchema.belongsTo(HomeOwnerAssociationSchema);
ObjectionSchema.hasMany(VoteSchema);

RuleListSchema.hasMany(RuleSchema);

RuleListSchema.belongsTo(HomeOwnerAssociationSchema);

RuleSchema.belongsTo(RuleListSchema);

UnitSchema.belongsTo(UserSchema);
UnitSchema.belongsTo(HomeOwnerAssociationSchema);

UserSchema.hasMany(UnitSchema);
UserSchema.hasMany(VoteSchema);
UserSchema.hasMany(ObjectionSchema);
UserSchema.hasMany(ObjectionSchema);
UserSchema.belongsToMany(HomeOwnerAssociationSchema, {
  through: { model: UnitSchema, unique: false },
  as: 'associations',
});

UserSchema.hasMany(ForgottenPasswordTokenSchema);

VoteSchema.belongsTo(UserSchema);
VoteSchema.belongsTo(ObjectionSchema);

export const Association = HomeOwnerAssociationSchema;
export const Document = DocumentSchema;
export const ForgottenPasswordToken = ForgottenPasswordTokenSchema;
export const Objection = ObjectionSchema;
export const RuleList = RuleListSchema;
export const Rule = RuleSchema;
export const Unit = UnitSchema;
export const User = UserSchema;
export const Vote = VoteSchema;
