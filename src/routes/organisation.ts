import express, { Request, Response } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { v4 as uuidv4 } from "uuid";
import { AuthRequest } from "../../types";
import { UserOrganisation, Organisation, User } from "../models";

const router = express.Router();

router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req?.user?.userId;
    const organisations = await UserOrganisation.findAll({
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
  } catch (error) {
    res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
    });
  }
});

router.post("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;
    const userId = req?.user?.userId;

    if (!name) {
      return res.status(422).json({
        status: "error",
        message: "Name is required",
      });
    }

    const organisation = await Organisation.create({
      orgId: uuidv4(),
      name,
      description,
    });

    await UserOrganisation.create({
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
  } catch (error) {
    res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
    });
  }
});

router.get(
  "/:orgId",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { orgId } = req.params;
      const organisation = await Organisation.findByPk(orgId);

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
    } catch (error) {
      res.status(400).json({
        status: "Bad Request",
        message: "Client error",
        statusCode: 400,
      });
    }
  }
);

router.post(
  "/:orgId/users",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { orgId } = req.params;
      const { userId } = req.body;

      const organisation = await Organisation.findByPk(orgId);

      if (!organisation) {
        return res.status(404).json({
          status: "error",
          message: "Organisation not found",
        });
      }

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }

      await UserOrganisation.create({
        userId,
        orgId,
      });

      res.status(200).json({
        status: "success",
        message: "User added to organisation successfully",
      });
    } catch (error) {
      res.status(400).json({
        status: "Bad Request",
        message: "Client error",
        statusCode: 400,
      });
    }
  }
);

export default router;
