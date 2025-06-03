import { body } from "express-validator";

const validTypes = ["single", "multiple", "true_false", "open"];

export const validateAddQuestion = [
  body("text").trim().notEmpty().withMessage("Question text is required"),

  body("type")
    .isIn(validTypes)
    .withMessage(`Type must be one of: ${validTypes.join(", ")}`),

  body("options")
    .if(body("type").isIn(["single", "multiple", "true_false"]))
    .isArray({ min: 2 })
    .withMessage("Options must be an array with at least 2 items"),

  body("correctAnswers")
    .isArray({ min: 1 })
    .withMessage("At least one correct answer is required"),

  body("points")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Points must be a non-negative integer"),

  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Order must be a non-negative integer"),

  body("hint").optional().isString().withMessage("Hint must be a string"),
];

export const validateEditQuestion = [
  body("text")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Text cannot be empty if provided"),

  body("type")
    .optional()
    .isIn(validTypes)
    .withMessage(`Type must be one of: ${validTypes.join(", ")}`),

  body("options")
    .optional()
    .isArray({ min: 2 })
    .withMessage("Options must be an array with at least 2 items"),

  body("correctAnswers")
    .optional()
    .isArray({ min: 1 })
    .withMessage("CorrectAnswers must be a non-empty array"),

  body("points")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Points must be a non-negative integer"),

  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Order must be a non-negative integer"),

  body("hint").optional().isString().withMessage("Hint must be a string"),
];
