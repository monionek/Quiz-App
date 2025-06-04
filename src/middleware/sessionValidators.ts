import { body, param } from "express-validator";

export const validateStartSession = [
  param("id").isString().withMessage("Quiz ID must be an string"),
];

export const validateSubmitAnswer = [
  param("sessionId").isMongoId().withMessage("Invalid session ID"),
  body("questionId").isString().withMessage("Question ID must be an integer"),
  body("selectedAnswers")
    .isArray({ min: 1 })
    .withMessage("selectedAnswers must be a non-empty array"),
];
