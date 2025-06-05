import { Request, Response } from "express";
import { Category } from "../models/postgresModels";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ message: "Category name required" });
      return;
    }
    const existing = await Category.findOne({ where: { name } });
    if (existing) {
      res
        .status(404)
        .json({ message: "Category with that name already exists" });
      return;
    }

    const category = await Category.create({ name });
    res.status(201).json({ category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create category" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const catId = req.params.id;
    const cat = await Category.findByPk(catId);
    if (!cat) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    await cat.destroy();
    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });
    res.status(200).json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};
