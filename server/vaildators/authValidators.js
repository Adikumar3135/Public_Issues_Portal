import { body } from "express-validator";

export const registerValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ max: 100 })
        .withMessage("Name cannot exceed 100 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Enter a valid email")
        .normalizeEmail(),

    body("password")
        .isString()
        .withMessage("Password must be a string")
        .isLength({ min: 12, max: 72 })
        .withMessage("Password must be between 12 and 72 characters")
];

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email")
    .normalizeEmail(),

  body("password")
    .isString()
    .withMessage("Password must be a string")
    .notEmpty()
    .withMessage("Password is required")
];


export const createComplaintValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Complaint title is required")
    .isLength({ max: 150 })
    .withMessage("Title cannot exceed 150 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 3000 })
    .withMessage("Description cannot exceed 3000 characters"),

  body("category")
    .isIn([
      "Road",
      "Sanitation",
      "Water",
      "Electricity",
      "Drainage",
      "Other"
    ])
    .withMessage("Invalid complaint category"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ max: 300 })
    .withMessage("Address cannot exceed 300 characters"),

  body("latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude"),

  body("longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude")
];