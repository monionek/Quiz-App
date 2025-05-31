import { Request, Response } from "express";
import { User } from "../models/postgresModels/userModel";
import { Op } from "sequelize";
import { hashPassword, verifyPassword } from "../utils/hashPassword";
import { validationResult } from "express-validator";
import { generateToken } from "../utils/jwtGenerator";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() }); // 422 Unprocessable Entity
      return;
    }
    const { name, password, email } = req.body;
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username: name }],
      },
    });
    if (existingUser) {
      res.status(400).json({ message: "Name or Email already taken" });
      return;
    }
    const hashedPassword = hashPassword(password);
    const newUser = await User.create({
      username: name,
      password: hashedPassword,
      email: email,
    });
    if (newUser) {
      res.status(201).json({ message: "User Registered" });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Server error" });
    return;
  }
};

export const getUser = async (req: Request, res: Response) => {
 try {
    const selector = req.params.selector;
    const existingUser = await User.findOne({
      where: { username: selector }});
    if (existingUser) {
      res.status(201).json({ user: existingUser });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Server error" }); //dobrać odpowiedni kod to tego
    return;
  }
  res.status(404).json({ message: "user not found"})
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() }); // 422 Unprocessable Entity
      return;
    }
    const { login, password } = req.body;
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email: login }, { username: login }],
      },
    });
    if (!existingUser) {
      res.status(404).json({ message: "user with this login dont exsist"})
      return;
    }
    const hashedPassword = existingUser.get().password;
    const pass = verifyPassword(password, hashedPassword);
    if (pass) {
      const payload = {
        username: existingUser.get().username,
        role: existingUser.get().role
      }
      const token = generateToken(payload);
      res.status(201).json({ token: token});
      return;
  }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
  res.status(400).json({ message: "Invalid password" });
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(403).json({ message: 'You must be logged in to update user' });
      return
    }

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

    const updates: any = {}

    if (req.body.email !== undefined) {
      updates.email = req.body.email
    }

    if (req.body.username !== undefined) {
      updates.username = req.body.username
    }

    if (req.body.password !== undefined) {
      updates.password = hashPassword(req.body.password)
    }

    if (Object.keys(updates).length === 0) { 
      res.status(400).json({ message: 'No valid fields to update' })
      return;
    }

    const [updatedCount] = await User.update(updates, {
      where: { username: req.user.username },
    })

    if (updatedCount === 0) {
      res.status(400).json({ message: 'User not found or nothing was updated' });
      return;
    }

    res.status(200).json({ message: 'User updated successfully' });
    return;
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' });
    return;
  }
}