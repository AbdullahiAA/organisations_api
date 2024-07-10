"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("../database/index"));
class Organisation extends sequelize_1.Model {
}
Organisation.init({
    orgId: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: index_1.default,
    modelName: "Organisation",
});
exports.default = Organisation;
