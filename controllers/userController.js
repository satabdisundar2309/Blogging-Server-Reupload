const userModel = require("../models/userModel");
const blogModel = require("../models/blogModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const { ErrorHandler } = require("../middlewares/error");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

// ! user registration
const registerUser = catchAsyncErrors(async (req, res, next) => {

  const { name, email, phone, education, role, password, confirmPassword, avatar } =
    req.body;

  if (
    !name ||
    !email ||
    !phone ||
    !education ||
    !role ||
    !password ||
    !confirmPassword
  ) {
    return next(new ErrorHandler("Please provide complete details!", 400));
  }

  if(!avatar){
    return next(new ErrorHandler("Profile picture is required", 400));
  }

  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password and confirm password didn't match", 400)
    );
  }

  let user = await userModel.findOne({ email: email });
  if (user) {
    return next(new ErrorHandler("User already exists", 400));
  }

  const newUser = await userModel.create({
    name,
    email,
    phone,
    education,
    role,
    password,
    avatar
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  res.status(200).json({
    success: true,
    message: "User registered successfully...",
    user: newUser,
    token: token,
  });
});

//! user log in
const userLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return next(new ErrorHandler("Please fill full form!", 400));
  }

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("User does not exist", 400));
  }

  const isCorrectPassword = await user.comparePassword(password);
  if (!isCorrectPassword) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  if (user.role !== role) {
    return next(new ErrorHandler(`User with this role is not found`, 400));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  res.status(200).json({
    success: true,
    message: "User logged in successfully...",
    user: user,
    token: token,
  });
});

// ! user logout
const userLogout = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "User logged out!",
  });
});

// ! get single user data
const getMyProfile = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user: user,
  });
});

// ! get all authors
const getAllAuthors = catchAsyncErrors(async (req, res, next) => {
  const authors = await userModel.find({ role: "Author" });
  res.status(200).json({
    success: true,
    authors: authors,
  });
});

module.exports = {
  registerUser,
  userLogin,
  userLogout,
  getMyProfile,
  getAllAuthors,
};
