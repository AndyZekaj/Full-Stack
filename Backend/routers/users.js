import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from "uuid";
import { getUsers, loginUser, registerUser, verifyUser } from '../controllers/users.js';
const router = express.Router();
import { loginValidation, user_validations } from "../middlewares/validations.js";
import auth, { isallowed } from "../middlewares/users.js"

// setup multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const myFileName = uuidv4() + "_" + file.originalname
        req.myFileName = myFileName;
        cb(null, myFileName)
    }
});

const upload = multer({storage})

// register route
router.get('/', getUsers);
// Register
router.post('/register', user_validations, upload.single('profile'), registerUser);
// Login
router.post("/login", loginValidation, loginUser)
// Verify Token
router.get("/verify/:token", verifyUser)
// Get Users List
router.get("/list", auth, isallowed(["admin"]), getUsers)


export default router;