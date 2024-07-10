"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const models_1 = require("../models");
const router = express_1.default.Router();
router.post("/register", async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;
    const errors = [];
    if (!firstName)
        errors.push({ field: "firstName", message: "First name is required" });
    if (!lastName)
        errors.push({ field: "lastName", message: "Last name is required" });
    if (!email)
        errors.push({ field: "email", message: "Email is required" });
    if (!password)
        errors.push({ field: "password", message: "Password is required" });
    if (!phone)
        errors.push({ field: "phone", message: "Phone number is required" });
    if (errors.length > 0) {
        return res.status(422).json({ errors });
    }
    try {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await models_1.User.create({
            userId: (0, uuid_1.v4)(),
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
        });
        const org = await models_1.Organisation.create({
            orgId: (0, uuid_1.v4)(),
            name: `${firstName}'s Organisation`,
            description: "",
        });
        await models_1.UserOrganisation.create({
            userId: user.userId,
            orgId: org.orgId,
        });
        res.status(201).json({
            status: "success",
            message: "Registration successful",
            data: {
                accessToken: jsonwebtoken_1.default.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: "1h" }),
                user: {
                    userId: user.userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                },
            },
        });
    }
    catch (error) {
        res.status(400).json({
            status: "Bad request",
            message: "Registration unsuccessful",
            statusCode: 400,
        });
    }
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(401).json({
            status: "Bad request",
            message: "Authentication failed",
            statusCode: 401,
        });
    }
    const user = await models_1.User.findOne({ where: { email } });
    if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
        return res.status(401).json({
            status: "Bad request",
            message: "Authentication failed",
            statusCode: 401,
        });
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({
        status: "success",
        message: "Login successful",
        data: {
            accessToken: token,
            user: {
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
            },
        },
    });
});
exports.default = router;
