const PostModel = require('../Models/post');
let exportRoutes = {};

exportRoutes.post =  async function(req,res){
  try {
    let post = new PostModel({
      ...req.body,
       PostImage: req.file.filename
    });

    await post.save();

    res.status(201).json({
      message: 'Data posted successfully',
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({
      error: 'An error occurred',
      mess: err.message,
    });
  }

}

exportRoutes.get = async function(req,res){
    try{
        let posts = await PostModel.find();
        res.status(200).json({status:"Success", result : posts});
    }
    catch(err)
    {
        res.status(400).json({status:"failed", message : err.message});
    }
}

module.exports = exportRoutes;
