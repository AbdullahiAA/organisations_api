import Organisation from "./Organisation";
import User from "./User";
import UserOrganisation from "./UserOrganisation";

User.belongsToMany(Organisation, {
  through: "UserOrganisation",
  foreignKey: "userId",
  //   as: "org",
});

Organisation.belongsToMany(User, {
  through: "UserOrganisation",
  foreignKey: "orgId",
  //   as: "user",
});

export { User, Organisation, UserOrganisation };
