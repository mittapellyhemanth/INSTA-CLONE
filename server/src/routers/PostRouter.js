const express = require('express');
const router = express.Router();
const PostModel = require('../Models/post')

router.post('/posts', async(req,res)=>{
  
    console.log("req",req.body)
let post = new PostModel({
      name: req.body.name,
      location: req.body.location,
      description: req.body.description,
      PostImage: req.file.filename, // File uploaded
    });

     await post.save().then(post=>{
      res.status(201).json({
        message: 'Data posted successfully',
        result:post
      });
     }).catch(err=>{
      res.status(500).json({
        error: 'An error occurred',
        mess: err.message,
      });
     })

})

module.exports = router
