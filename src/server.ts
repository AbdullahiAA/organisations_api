import "reflect-metadata";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import sequelize from "./database";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import organisationRoutes from "./routes/organisation";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/organisations", organisationRoutes);

app.get("/", (req: Request, res: Response) => {
res.status(200).send("Successful");
})

app.all("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: "Not Found",
    message: "Route not found",
    statusCode: 404,
  });
});

const PORT = process.env.PORT || 5050;

sequelize.sync().then(() => {
  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

export default app;
