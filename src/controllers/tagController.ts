import { Request, Response } from "express";
import { Tag } from "../models/postgresModels";

export const createTag = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ message: "Tag name required" });
      return;
    }
    const existing = await Tag.findOne({ where: { name } });
    if (existing) {
      res.status(400).json({ message: "Tag with that name already exists" });
      return;
    }

    const tag = await Tag.create({ name });
    res.status(201).json({ tag });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create tag" });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    const tagId = req.params.id;
    const tag = await Tag.findByPk(tagId);
    if (!tag) {
      res.status(404).json({ message: "Tag not found" });
      return;
    }
    await tag.destroy();
    res.status(200).json({ message: "Tag deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};
