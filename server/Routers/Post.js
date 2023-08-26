const express = require('express');
const PostModel = require('../model/postModel')
const routers = express.Router();
const multer = require('multer');

routers.get('/getPost', async (req, res) => {
    try {
        const posts = await PostModel.find().sort({ createdAt: -1 }); // Sort posts by createdAt in descending order
        const postsWithFormattedDate = posts.map(post => ({
            ...post.toObject(),
            formattedCreatedAt: new Date(post.createdAt).toString()
        }));

        res.status(200).json({
            message: 'Posts fetched successfully',
            result: postsWithFormattedDate
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching posts',
            error: error
        });
    }
});


const storage = multer.diskStorage({
    destination:function(req,file,cb){
      return cb(null,'./uploads')
    },
    filename:function(req,file,cb){
    return cb(null,`${Date.now()}-${file.originalname}`)
    }

})
const upload = multer({storage})
routers.post('/post',upload.single('PostImage'), async (req,res)=>{
  
    try{
       const post =new PostModel ({
        name:req.body.name,
         location:req.body.location,
         description:req.body.description,
         likes:req.body.likes,
         date:new Date().toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }),
         PostImage:req.file.filename
    })
    
       await post.save().then(result=>{
           
        res.status(201).json({
            message:"data posted sucessfully",
            submit:result
        })
       }).catch(err=>{
        res.status(500).json({
            error:'An error occured',
            mess:err
        })
       })
       
   } 
   catch(err){res.json({
    error:err
   })
   }
})

module.exports = routers ;
