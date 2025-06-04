import { Request, Response } from "express";
import { User } from "../models/postgresModels/userModel";
import { Op } from "sequelize";
import { hashPassword, verifyPassword } from "../utils/hashPassword";
import { generateToken } from "../utils/jwtGenerator";
import { generatePassword } from "../utils/generateNewPassword";
import { UpdateUserInterface } from "../models/models";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, password, email } = req.body;
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username: name }],
      },
    });
    if (existingUser) {
      res.status(400).json({ message: "username or Email already taken" });
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
      where: { username: selector },
    });
    if (existingUser) {
      res.status(201).json({ username: existingUser });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Server error" }); //dobrać odpowiedni kod to tego
    return;
  }
  res.status(404).json({ message: "user not found" });
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
    if (pass) {
      const payload = {
        username: existingUser.get().username,
        role: existingUser.get().role,
        id: existingUser.get().userId,
      };
      const token = generateToken(payload);
      res.status(201).json({ token: token });
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

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ message: "No valid fields to update" });
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
    const updateRole = await User.update(
      { role: req.body.role },
      { where: { username: req.params.name } },
    );
    if (updateRole.length > 0) {
      res.status(200).json({ message: "User role updated successfully" });
    }
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const restartPassword = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const userToRestart = await User.findOne({ where: { email } });
    if (!userToRestart) {
      res.status(404).json({ message: "No user w registered email" });
      return;
    }
    const newPassword = generatePassword(); // OK
    const hashed = hashPassword(newPassword); // brak!
    const update = await User.update(
      { password: hashed },
      { where: { email } },
    );
    if (update.length > 0) {
      res.status(201).json({ RestartPassword: newPassword });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};
