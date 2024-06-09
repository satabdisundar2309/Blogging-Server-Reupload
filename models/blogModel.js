const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    minLength: [3, "Blog title must contain atleast 3 characters"],
  },
  mainImage: {
    type: String,
    required: true,
  },
  intro: {
    type: String,
    required: true,
    minLength: [100, "Blog intro must contain at least 100 characters!"],
  },
  paraOneImage: {
    type: String,
  },
  paraOneDescription: {
    type: String,
  },
  paraOneTitle: {
    type: String,
  },
  paraTwoImage: {
    type: String,
  },
  paraTwoDescription: {
    type: String,
  },
  paraTwoTitle: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  authorAvatar: {
    type: String,
    required: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
});

const blogModel = mongoose.model("Blog", blogSchema);
module.exports = blogModel;
