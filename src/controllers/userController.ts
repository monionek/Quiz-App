import { Request, Response } from "express";
import { User } from "../models/postgresModels/userModel";
import { Op } from "sequelize";
import { hashPassword, verifyPassword } from "../utils/hashPassword";
import { generateToken } from "../utils/jwtGenerator";
import { generatePassword } from "../utils/generateNewPassword";
import { UpdateUserInterface } from "../models/models";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username: username }],
      },
    });
    if (existingUser) {
      res.status(400).json({ message: "username or Email already taken" });
      return;
    }
    const hashedPassword = hashPassword(password);
    const reqisteredUser = await User.create({
      username: username,
      password: hashedPassword,
      email: email,
    });
    res.status(201).json({ user: reqisteredUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const existingUser = await User.findByPk(userId)
    if (!existingUser) {
      res.status(404).json({message: "user not found"});
      return;
    }
    res.status(302).json({ user: existingUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email: login }, { username: login }],
      },
    });
    if (!existingUser) {
      res.status(404).json({ message: "user with this login dont exsist" });
      return;
    }
    const hashedPassword = existingUser.get().password;
    const pass = verifyPassword(password, hashedPassword);
    if (!pass) {
      res.status(403).json({message: "invalid password"})
    }
      const payload = {
        username: existingUser.get().username,
        role: existingUser.get().role,
        id: existingUser.get().id,
      };
      const token = generateToken(payload);
      res.status(201).json({ token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updates: UpdateUserInterface = {};

    if (req.body.email !== undefined) {
      updates.email = req.body.email;
    }

    if (req.body.username !== undefined) {
      updates.username = req.body.username;
    }

    if (req.body.password !== undefined) {
      updates.password = hashPassword(req.body.password);
    }
    const taken = await User.findAll({where:{ [Op.or]: [{username: updates.username}, {email: updates.email}]}});
    if (taken.length > 0) {
      res.status(403).json({message: "email or username taken"});
      return;
    }
    const userToUpdate = await User.findByPk(req.user?.id);
    if (!userToUpdate) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    await userToUpdate.update(updates);
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const userToUpdateRole = await User.findByPk(req.params.id);
    if (!userToUpdateRole) {
      res.status(404).json({message: "user not found"});
      return;
    }
    await userToUpdateRole.update({ role: req.body.role })
      res.status(200).json({ message: "User role updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const restartPassword = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const userToRestart = await User.findOne({ where: { email } });
    if (!userToRestart) {
      res.status(404).json({ message: "No user with registered email" });
      return;
    }
    const newPassword = generatePassword();
    const hashed = hashPassword(newPassword);
    await userToRestart.update({password: hashed});
    res.status(201).json({ RestartPassword: newPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
