import { body } from "express-validator";

const validateQuiz = [
  body("title").notEmpty().withMessage("Title must be provided"),

  body("description").notEmpty().withMessage("Description must be provided"),

  body("category")
    .isArray({ min: 1 })
    .withMessage("Category must be a non-empty array of strings")
    .custom((arr) => {
      if (!arr.every((item: any) => typeof item === "string")) {
        throw new Error("All category items must be strings");
      }
      return true;
    }),

  body("difficulty")
    .notEmpty()
    .withMessage("Difficulty must be provided")
    .isIn(["easy", "medium", "hard"])
    .withMessage("Difficulty must be one of: easy, medium, hard"),

  body("duration")
    .isInt({ min: 10 })
    .withMessage("Duration must be an integer (seconds) and at least 10"),

  body("isPrivate").isBoolean().withMessage("isPrivate must be a boolean"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array")
    .custom((arr) => {
      if (!arr.every((item: any) => typeof item === "string")) {
        throw new Error("All tags must be strings");
      }
      return true;
    }),
];

export default validateQuiz;
