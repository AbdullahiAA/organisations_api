import { JwtPayload } from "./src/middleware/authMiddleware";
import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
