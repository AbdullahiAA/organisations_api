import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: "postgres",
  models: [__dirname + "/models"],
});

// Add connection callback
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err: Error) => {
    console.error("Unable to connect to the database:", err);
  });

export default sequelize;
