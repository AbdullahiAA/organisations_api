import { Model, DataTypes } from "sequelize";
import sequelize from "../database/index";

class Organisation extends Model {
  public orgId!: string;
  public name!: string;
  public description!: string;
}

Organisation.init(
  {
    orgId: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Organisation",
  }
);

export default Organisation;
