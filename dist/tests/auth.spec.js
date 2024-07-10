"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const database_1 = __importDefault(require("../database"));
beforeAll(async () => {
    await database_1.default.sync({ force: true });
});
afterAll(async () => {
    await database_1.default.close();
});
describe("Auth Endpoints", () => {
    it("Should register a user successfully with a default organisation", async () => {
        const res = await (0, supertest_1.default)(server_1.default).post("/auth/register").send({
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
        const res = await (0, supertest_1.default)(server_1.default).post("/auth/login").send({
            email: "mark@hng.com",
            password: "12345678",
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("data");
        expect(res.body.data).toHaveProperty("accessToken");
    });
    it("Should fail if required fields are missing", async () => {
        const res = await (0, supertest_1.default)(server_1.default).post("/auth/register").send({
            firstName: "Mark",
        });
        expect(res.statusCode).toEqual(422);
        expect(res.body).toHaveProperty("errors");
    });
    it("Should fail if there is a duplicate email", async () => {
        const res = await (0, supertest_1.default)(server_1.default).post("/auth/register").send({
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
