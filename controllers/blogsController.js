const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const { ErrorHandler } = require("../middlewares/error");
const userModel = require("../models/userModel");
const blogModel = require("../models/blogModel");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

// ! post a blog
const blogPost = catchAsyncErrors(async (req, res, next) => {

  const { mainImage, paraOneImage, paraTwoImage, title, intro,
    paraOneDescription,
    paraOneTitle,
    paraTwoDescription,
    paraTwoTitle,
    category,
    published } = req.body;
  if (!mainImage) {
    return next(new ErrorHandler("Please upload blog main image!", 400));
  }


  const createdBy = req.user._id;
  const authorName = req.user.name;
  const authorAvatar = req.user.avatar;

  if (!title || !category || !intro) {
    return next(
      new ErrorHandler("Please fill Title, Intro and Category!", 400)
    );
  }

  const blogData = {
    title,
    intro,
    paraOneDescription,
    paraOneTitle,
    paraTwoDescription,
    paraTwoTitle,
    category,
    createdBy,
    authorAvatar,
    authorName,
    published, 
    mainImage
  };

  if (paraOneImage) {
    blogData.paraOneImage = paraOneImage
  }
  if (paraTwoImage) {
    blogData.paraTwoImage = paraTwoImage
  }

  const blog = await blogModel.create(blogData);

  res.status(200).json({
    success: true,
    message: "Blog Uploaded!",
    blog: blog,
  });
});

// ! delete a blog
const deleteBlog = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const blog = await blogModel.findByIdAndDelete({ _id: id });
  if (!blog) {
    return next(new ErrorHandler("Blog not found!", 404));
  }
  res.status(200).json({
    success: true,
    message: "Blog deleted!",
  });
});

//! get all blogs
const getAllBlogs = catchAsyncErrors(async (req, res, next) => {
  const allBlogs = await blogModel.find({ published: true });
  res.status(200).json({
    success: true,
    blogs: allBlogs,
  });
});

// ! get single blog
const getSingleBlog = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const blog = await blogModel.findById({ _id: id });
  if (!blog) {
    return next(new ErrorHandler("Blog not found!", 404));
  }
  res.status(200).json({
    success: true,
    blog: blog,
  });
});

// ! get my blogs
const getMyBlogs = catchAsyncErrors(async (req, res, next) => {
  const createdBy = req.user._id;
  const blogs = await blogModel.find({ createdBy: createdBy });
  res.status(200).json({
    success: true,
    blogs: blogs,
  });
});

//! update blog
const updateBlog = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let blog = await blogModel.findById(id);
  if (!blog) {
    return next(new ErrorHandler("Blog not found!", 404));
  }
  const newBlogData = {
    title: req.body.title,
    intro: req.body.intro,
    category: req.body.category,
    paraOneTitle: req.body.paraOneTitle,
    paraOneDescription: req.body.paraOneDescription,
    paraTwoTitle: req.body.paraTwoTitle,
    paraTwoDescription: req.body.paraTwoDescription,
    published: req.body.published,
    mainImage: req.body.mainImage,
    paraOneImage: req.body.paraOneImage,
    paraTwoImage: req.body.paraTwoImage
  };


  blog = await blogModel.findByIdAndUpdate({ _id: id }, newBlogData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Blog Updated!",
    blog: blog,
  });
});

module.exports = {
  blogPost,
  deleteBlog,
  getAllBlogs,
  getSingleBlog,
  getMyBlogs,
  updateBlog,
};
