import { body } from "express-validator";

export const validateQuestionCreate = [
  body("type")
    .exists({ checkFalsy: true }).withMessage("type is required")
    .isIn(["single", "multiple", "true_false", "open"]).withMessage("type must be one of: single, multiple, true_false, open"),

  body("text")
    .exists({ checkFalsy: true }).withMessage("text is required")
    .isString().withMessage("text must be a string"),

  body("options")
    .if(body("type").not().equals("open"))
    .exists({ checkFalsy: true }).withMessage("options are required for this question type")
    .isArray({ min: 1 }).withMessage("options must be a non-empty array")
    .custom((arr) => arr.every((item: any) => typeof item === "string")).withMessage("all options must be strings")
    .custom((options, { req }) => {
      if (req.body.type === "true_false") {
        if (options.length !== 2) {
          throw new Error("For 'true_false' type, options must contain exactly 2 items");
        }
        const hasTrue = options.includes("true");
        const hasFalse = options.includes("false");
        if (!hasTrue || !hasFalse) {
          throw new Error("For 'true_false' type, options must include both 'true' and 'false'");
        }
      }
      return true;
    }),

  body("correctAnswers")
    .exists({ checkFalsy: true }).withMessage("correctAnswers are required")
    .isArray({ min: 1 }).withMessage("correctAnswers must be a non-empty array")
    .custom((arr) => arr.every((item: any) => typeof item === "string")).withMessage("all correctAnswers must be strings")
    .custom((correctAnswers, { req }) => {
      const { type, options } = req.body;
      if (type !== "open" && Array.isArray(options)) {
        const invalid = correctAnswers.filter((ans: string) => !options.includes(ans));
        if (invalid.length > 0) {
          throw new Error(`All correctAnswers must exist in options. Invalid: ${invalid.join(", ")}`);
        }
      }
      return true;
    }),

  body("hint")
    .optional()
    .isString().withMessage("hint must be a string"),

  body("points")
    .optional()
    .isInt({ min: 0 }).withMessage("points must be an integer >= 0"),

  body("order")
    .optional()
    .isInt({ min: 0 }).withMessage("order must be an integer >= 0"),
];




export const validateQuestionEdit = [

  body("text")
    .optional()
    .isString().withMessage("text must be a string")
    .notEmpty().withMessage("text cannot be empty"),

  body("options")
    .optional()
    .isArray({ min: 1 }).withMessage("options must be a non-empty array of strings")
    .custom((arr) => arr.every((item: any) => typeof item === "string")).withMessage("all options must be strings"),

  body("correctAnswers")
    .optional()
    .isArray({ min: 1 }).withMessage("correctAnswers must be a non-empty array")
    .custom((arr) => arr.every((item: any) => typeof item === "string")).withMessage("all correctAnswers must be strings")
    .custom((correctAnswers, { req }) => {
      const options = req.body.options;
      if (options && Array.isArray(options)) {
        const invalid = correctAnswers.filter((ans: string) => !options.includes(ans));
        if (invalid.length > 0) {
          throw new Error(`All correctAnswers must be present in options. Invalid: ${invalid.join(", ")}`);
        }
      }
      return true;
    }),

  body("hint")
    .optional()
    .isString().withMessage("hint must be a string"),

  body("points")
    .optional()
    .isInt({ min: 0 }).withMessage("points must be an integer >= 0"),

  body("order")
    .optional()
    .isInt({ min: 0 }).withMessage("order must be an integer >= 0"),
];
