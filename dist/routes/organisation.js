"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const uuid_1 = require("uuid");
const models_1 = require("../models");
const router = express_1.default.Router();
router.get("/", authMiddleware_1.authenticateToken, async (req, res) => {
    try {
        const userId = req?.user?.userId;
        const organisations = await models_1.UserOrganisation.findAll({
            where: { userId },
            // include: [
            //   {
            //     model: User,
            //     // as: "userId",
            //   },
            // ],
        });
        res.status(200).json({
            status: "success",
            message: "Organisations retrieved successfully",
            data: {
                organisations,
            },
        });
    }
    catch (error) {
        res.status(400).json({
            status: "Bad Request",
            message: "Client error",
            statusCode: 400,
        });
    }
});
router.post("/", authMiddleware_1.authenticateToken, async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req?.user?.userId;
        if (!name) {
            return res.status(422).json({
                status: "error",
                message: "Name is required",
            });
        }
        const organisation = await models_1.Organisation.create({
            orgId: (0, uuid_1.v4)(),
            name,
            description,
        });
        await models_1.UserOrganisation.create({
            userId,
            orgId: organisation.orgId,
        });
        res.status(201).json({
            status: "success",
            message: "Organisation created successfully",
            data: {
                orgId: organisation.orgId,
                name: organisation.name,
                description: organisation.description,
            },
        });
    }
    catch (error) {
        res.status(400).json({
            status: "Bad Request",
            message: "Client error",
            statusCode: 400,
        });
    }
});
router.get("/:orgId", authMiddleware_1.authenticateToken, async (req, res) => {
    try {
        const { orgId } = req.params;
        const organisation = await models_1.Organisation.findByPk(orgId);
        if (!organisation) {
            return res.status(404).json({
                status: "error",
                message: "Organisation not found",
            });
        }
        res.status(200).json({
            status: "success",
            message: "Organisation retrieved successfully",
            data: {
                orgId: organisation.orgId,
                name: organisation.name,
                description: organisation.description,
            },
        });
    }
    catch (error) {
        res.status(400).json({
            status: "Bad Request",
            message: "Client error",
            statusCode: 400,
        });
    }
});
router.post("/:orgId/users", authMiddleware_1.authenticateToken, async (req, res) => {
    try {
        const { orgId } = req.params;
        const { userId } = req.body;
        const organisation = await models_1.Organisation.findByPk(orgId);
        if (!organisation) {
            return res.status(404).json({
                status: "error",
                message: "Organisation not found",
            });
        }
        const user = await models_1.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found",
            });
        }
        await models_1.UserOrganisation.create({
            userId,
            orgId,
        });
        res.status(200).json({
            status: "success",
            message: "User added to organisation successfully",
        });
    }
    catch (error) {
        res.status(400).json({
            status: "Bad Request",
            message: "Client error",
            statusCode: 400,
        });
    }
});
exports.default = router;
