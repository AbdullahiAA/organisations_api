"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const utils_1 = require("../utils");
const models_1 = require("../models");
const router = express_1.default.Router();
router.get("/:id", authMiddleware_1.authenticateToken, async (req, res) => {
    const userId = req?.user?.userId;
    const { id } = req.params;
    const user = await models_1.User.findByPk(id);
    if (!user) {
        return res.status(404).json({
            status: "error",
            message: "User not found",
        });
    }
    const usersOrg = await models_1.UserOrganisation.findAll({ where: { userId: id } });
    const usersOrgIds = usersOrg.map((i) => i.orgId);
    const requesterOrg = await models_1.UserOrganisation.findAll({
        where: { userId: userId },
    });
    const requesterOrgIds = requesterOrg.map((i) => i.orgId);
    if ((0, utils_1.hasCommonElement)(usersOrgIds, requesterOrgIds)) {
        return res.status(200).json({
            status: "success",
            message: "User retrieved successfully",
            data: {
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
            },
        });
    }
    else {
        return res.status(404).json({
            status: "error",
            message: "User not found",
        });
    }
});
exports.default = router;
