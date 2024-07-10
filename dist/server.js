"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./database"));
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const organisation_1 = __importDefault(require("./routes/organisation"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/auth", auth_1.default);
app.use("/api/users", user_1.default);
app.use("/api/organisations", organisation_1.default);
app.get("/", (req, res) => {
    res.status(200).send("Successful");
});
app.all("*", (req, res) => {
    res.status(404).json({
        status: "Not Found",
        message: "Route not found",
        statusCode: 404,
    });
});
const PORT = process.env.PORT || 5050;
database_1.default.sync().then(() => {
    app.listen(Number(PORT), "0.0.0.0", () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
exports.default = app;
