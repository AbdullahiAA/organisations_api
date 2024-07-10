import request from "supertest";
import app from "../server";
import sequelize from "../database";

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Auth Endpoints", () => {
  it("Should register a user successfully with a default organisation", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "Mark",
      lastName: "Angel",
      email: "mark@hng.com",
      password: "12345678",
      phone: "09012345678",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.user).toHaveProperty("userId");
    expect(res.body.data).toHaveProperty("accessToken");
  });

  it("Should log the user in successfully", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "mark@hng.com",
      password: "12345678",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("accessToken");
  });

  it("Should fail if required fields are missing", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "Mark",
    });

    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("errors");
  });

  it("Should fail if there is a duplicate email", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "Mark",
      lastName: "Angel",
      email: "mark@hng.com",
      password: "12345678",
      phone: "09012345678",
    });

    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("errors");
  });
});
