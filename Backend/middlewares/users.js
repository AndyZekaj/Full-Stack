import { createError } from "../utils/errors.js";
import jwt from 'jsonwebtoken';


export const auth = (req, res, next) => {
    try {
        //const jwt_token = req.headers.authorization.split(" ")[1];
        //extract token from the cookie
        console.log(req.cookies)
        const {jwt_token} = req.cookies

        const encoded = jwt.verify(jwt_token, "thisismysecretkey");

        const user = encoded._doc;
        user.password = undefined;
        req.user = user;

        next()
    } catch (error) {
        next(error)
    }
}

export const isallowed = (roles) => {
  return (req, res, next) => {
    try {
        console.log('isallowed')
      // compare the role of user with the parameter roles
      if (!roles.includes(req.user.role)) throw createError('This role is not allowed', 403);
      next()
    } catch (error) {
        next(error)
    }
  };
};
