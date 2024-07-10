"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOrganisation = exports.Organisation = exports.User = void 0;
const Organisation_1 = __importDefault(require("./Organisation"));
exports.Organisation = Organisation_1.default;
const User_1 = __importDefault(require("./User"));
exports.User = User_1.default;
const UserOrganisation_1 = __importDefault(require("./UserOrganisation"));
exports.UserOrganisation = UserOrganisation_1.default;
User_1.default.belongsToMany(Organisation_1.default, {
    through: "UserOrganisation",
    foreignKey: "userId",
    //   as: "org",
});
Organisation_1.default.belongsToMany(User_1.default, {
    through: "UserOrganisation",
    foreignKey: "orgId",
    //   as: "user",
});
