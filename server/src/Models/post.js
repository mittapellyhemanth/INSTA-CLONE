// const express = require('express');
const mongoose = require("mongoose");

const createPost =  mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
  location:{
    type: String,
    required: true,
  },
  likes :{
    type : Number
    },
  
  description:{
    type: String,
    required: true,
  },
  date : {
    type: String,
    default: Date.now
},
  PostImage:{
    type: String,
    
  },
 },
{
  timestamps  :true
}
);

const PostModel = mongoose.model("instaPost", createPost);

module.exports = PostModel;
// likes: {
//   type: Number,
//   required: true,
// },