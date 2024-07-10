import { JwtPayload } from "./src/middleware/authMiddleware";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
