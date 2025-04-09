import bcrypt from "bcryptjs";
import User, { VToken } from "../models/users.js";
import { createError } from "../utils/errors.js";
import { verifyEmailTemplate, verifyUserByEmail } from "../utils/mail.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const registerUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    const newToken = await VToken.create({
      userId: newUser._id,
      token: Date.now() + "_" + newUser._id,
    });

    // send Mail
    const mailresult = await verifyUserByEmail(
      newUser.email,
      "Verify your Email for your FullStack",
      verifyEmailTemplate(newUser.name, newToken.token)
    );

    res.json({
      success: true,
      msg: "User Created Successfully",
      data: {
        userId: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token: newToken.token,
        msgId: mailresult.msgId,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Verify User
export const verifyUser = async (req, res, next) => {
  try {
    const { token } = req.params;
    const tokenDoc = await VToken.findOne({ token });

    if (!tokenDoc) throw createError("Invalid link!", 404);
    if (tokenDoc.isVerified) throw createError("Already Verified!", 400);

    // update the user
    await User.findByIdAndUpdate(tokenDoc.userId, {
      verified: true,
      date: Date.now(),
    });

    // delete the token
    await VToken.deleteOne({ token });
    res.json({
      success: true,
      msg: "User Verified Successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Login User
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // find user by email
    const user = await User.findOne({ email });
    // handle bad email
    if (!user) throw createError("Invalid email or password! (email)", 401);
    // compare plain with hashed password
    if (!(await bcrypt.compare(password, user.password)))
      throw createError("Invalid email or password! (password)", 401);

    // create JWT
    const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // send response
    res.cookie("jwt_token", token, {
      httpOnly: true,
      expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).json({
        msg: "Login successful",
        user: user.clean(),
      }),
    });
  } catch (error) {
    next(error);
  }
};

// Logout User
export const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("jwt_token");
    res.json({
      success: true,
      msg: "Logout Successful",
    });
  } catch (error) {
    next(error);
  }
};

// list users
export const getUsers = (req, res, next) => {
    try {
        res.json({
            success: true,
            msg: "Users List",
            data: req.users,
        });
    } catch (error) {
        next(error)
    }
}