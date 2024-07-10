"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./database"));
const syncDatabase = async () => {
    try {
        await database_1.default.sync({ force: true }); // Use { force: true } to drop and recreate tables
        console.log("Database synced!");
    }
    catch (error) {
        console.error("Error syncing database:", error);
    }
    finally {
        await database_1.default.close();
    }
};
syncDatabase();
