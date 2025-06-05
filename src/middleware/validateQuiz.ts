import { body } from "express-validator";

export const validateQuiz = [
  body("title").notEmpty().withMessage("Title must be provided"),

  body("description").notEmpty().withMessage("Description must be provided"),

  body("categoryId").isInt().withMessage("Category must be a integer"),

  body("difficulty")
    .notEmpty()
    .withMessage("Difficulty must be provided")
    .isIn(["easy", "medium", "hard"])
    .withMessage("Difficulty must be one of: easy, medium, hard"),

  body("duration")
    .isInt({ min: 10 })
    .withMessage("Duration must be an integer (seconds) and at least 10"),

  body("isPrivate").isBoolean().withMessage("isPrivate must be a boolean")
];

export const validateQuizUpdate = [
  body("title").optional().isString(),
  body("description").optional().isString(),
  body("tags")
    .optional()
    .isArray()
    .custom((arr) => {
      if (!arr.every((item: any) => typeof item === typeof 1)) {
        throw new Error("All tagsid must be a integer");
      }
      return true;
    }),
  body("difficulty").optional().isIn(["easy", "medium", "hard"]),
  body("isPrivate").optional().isBoolean(),
  body("duration").optional().isNumeric(),
];
