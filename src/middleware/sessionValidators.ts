import { body, param } from "express-validator";

export const validateSubmitAnswer = [
  body("questionId").isString().withMessage("Question ID must be an integer"),
  body("selectedAnswers")
    .isArray({ min: 1 })
    .withMessage("selectedAnswers must be a non-empty array"),
];
