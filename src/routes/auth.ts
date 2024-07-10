import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { User, Organisation, UserOrganisation } from "../models";

const router = express.Router();

interface RegisterRequest extends Request {
  body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
  };
}

router.post("/register", async (req: RegisterRequest, res: Response) => {
  const { firstName, lastName, email, password, phone } = req.body;
  const errors = [];

  if (!firstName)
    errors.push({ field: "firstName", message: "First name is required" });
  if (!lastName)
    errors.push({ field: "lastName", message: "Last name is required" });
  if (!email) errors.push({ field: "email", message: "Email is required" });
  if (!password)
    errors.push({ field: "password", message: "Password is required" });
  if (!phone)
    errors.push({ field: "phone", message: "Phone number is required" });

  if (errors.length > 0) {
    return res.status(422).json({ errors });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userId: uuidv4(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    });

    const org = await Organisation.create({
      orgId: uuidv4(),
      name: `${firstName}'s Organisation`,
      description: "",
    });

    await UserOrganisation.create({
      userId: user.userId,
      orgId: org.orgId,
    });

    res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: {
        accessToken: jwt.sign(
          { userId: user.userId },
          process.env.JWT_SECRET as string,
          { expiresIn: "1h" }
        ),
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Bad request",
      message: "Registration unsuccessful",
      statusCode: 400,
    });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({
      status: "Bad request",
      message: "Authentication failed",
      statusCode: 401,
    });
  }

  const user = await User.findOne({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({
      status: "Bad request",
      message: "Authentication failed",
      statusCode: 401,
    });
  }

  const token = jwt.sign(
    { userId: user.userId },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

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

export default router;
