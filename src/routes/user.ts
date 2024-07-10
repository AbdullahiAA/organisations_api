import express, { Request, Response } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { hasCommonElement } from "../utils";
import { User, UserOrganisation } from "../models";

const router = express.Router();

router.get("/:id", authenticateToken, async (req: Request, res: Response) => {
  const userId = req?.user?.userId;

  const { id } = req.params;
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }

  const usersOrg = await UserOrganisation.findAll({ where: { userId: id } });
  const usersOrgIds = usersOrg.map((i) => i.orgId);

  const requesterOrg = await UserOrganisation.findAll({
    where: { userId: userId },
  });
  const requesterOrgIds = requesterOrg.map((i) => i.orgId);

  if (hasCommonElement(usersOrgIds, requesterOrgIds)) {
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
  } else {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }
});

export default router;
