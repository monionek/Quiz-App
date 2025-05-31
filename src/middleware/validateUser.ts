import { body } from "express-validator";

export const validateRegister = [
  body("name").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const validateLogin = [
  body("login").custom(() => {
    const isEmail = body("login").isEmail();
    const isUsername = body("login").notEmpty();
    if (!isEmail && !isUsername) {
      throw new Error("Login must be a valid email or username");
    }
    return true;
  }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at lest 6 characters"),
];

export const validateUpdate = [
  body("email").optional().isEmail().withMessage("Incorrect email format"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
export const validateUpdateRole = body("role").custom((value) => {
  if (value === "admin" || value === "user") {
    return true;
  }
  return false;
});
