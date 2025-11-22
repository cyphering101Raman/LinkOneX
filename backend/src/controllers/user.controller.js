import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
};


export const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, email, gender, password, confirmPassword } = req.body;

    if (!fullName || !username || !email || !password || !gender)
        throw new ApiError(400, "All fields are required");

    if (password !== confirmPassword)
        throw new ApiError(400, "Passwords do not match");

    const exists = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (exists) throw new ApiError(400, "User already exists");

    const user = await User.create({
        fullName,
        username,
        email,
        gender,
        password,
    });

    const createdUser = await User.findById(user._id).select("-password");

    const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE_IN }
    );

    return res
        .status(201)
        .cookie("token", token, cookieOptions)
        .json(new ApiResponse(201, createdUser, "User registered successfully"));
});


export const loginUser = asyncHandler(async (req, res) => {
    const { userid, password } = req.body;

    if (!userid || !password)
        throw new ApiError(400, "userid and password are required");

    const user = await User.findOne({
        $or: [{ email: userid }, { username: userid }],
    });

    if (!user) throw new ApiError(401, "User does not exist");

    const isValid = await user.isPasswordValid(password);
    if (!isValid) throw new ApiError(401, "Invalid credentials");

    const loggedUser = await User.findById(user._id).select("-password");

    const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE_IN }
    );

    return res
        .status(200)
        .cookie("token", token, cookieOptions)
        .json(new ApiResponse(200, loggedUser, "Login successful"));
});


export const logoutUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .clearCookie("token", cookieOptions)
        .json(new ApiResponse(200, null, "Logged out successfully"));
});
