import sequelize from "./database";

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // Use { force: true } to drop and recreate tables
    console.log("Database synced!");
  } catch (error) {
    console.error("Error syncing database:", error);
  } finally {
    await sequelize.close();
  }
};

syncDatabase();
