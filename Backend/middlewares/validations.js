import { body, validationResult } from "express-validator";
import User from "../models/users.js";

// get the validation results
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ msg: "❌ Validation Errors", Errors: errors.array() });
  }
  
  next();
};

// validating user inputs
export const user_validations = [
  body("name")
  .trim().escape()
    .notEmpty().withMessage("Name is a required field.")
    .matches(/^[A-Za-z\s]+$/).withMessage("Name should be alphabets only."),

  body("email")
  .trim().escape()
    .notEmpty().withMessage("Email is a required field.")
    .isEmail().withMessage("Email is not valid.")
    .custom(async (email_value) => {
      const user = await User.findOne({ email: email_value });
      if (user) throw new Error("Email is already in use");
      return true;
    }),


  body("confirm").custom((confirm_value, { req }) => {
    if (confirm_value !== req.body.password) 
      throw new Error("Password and Confirm Password are not match.");
    return true;
    }),


  body("password")
  .trim().escape()
    .notEmpty().withMessage("Password is required field")
    .isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    }).withMessage("Password is not valid"),
    validateRequest // to extract validation errors from request
  ];
  
  
  
  export const loginValidation = [
    body("email")
    .trim().escape()
    .notEmpty().withMessage('Invalid login')
    .isEmail().withMessage('Invalid login'),
    
    body("password")
    .trim().escape()
    .notEmpty().withMessage('Invalid login'),
    
    validateRequest // to extract validation errors from request
]