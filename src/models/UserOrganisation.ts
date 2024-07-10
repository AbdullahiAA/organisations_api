import { Model, DataTypes } from "sequelize";
import sequelize from "../database/index";

class UserOrganisation extends Model {
  public userId!: string;
  public orgId!: string;
}

UserOrganisation.init(
  {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    orgId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "UserOrganisation",
  }
);

UserOrganisation.removeAttribute("id");

export default UserOrganisation;
