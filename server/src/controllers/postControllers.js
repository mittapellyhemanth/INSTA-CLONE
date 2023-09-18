const PostModel = require('../Models/post');

let exportRoutes = {};

exportRoutes.post =  async function(req,res){
  try {
    const post = new PostModel({
      ...req.body,
      date: new Date().toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      PostImage: req.file.filename,
    });

    await post.save();

    res.status(201).json({
      message: "Data posted successfully",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      error: "An error occurred",
      mess: err.message,
    });
  }
}

exportRoutes.get = async function(req,res){
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 }); // Sort posts by createdAt in descending order
    const postsWithFormattedDate = posts.map((post) => ({
      ...post.toObject(),
      formattedCreatedAt: new Date(post.createdAt).toString(),
    }));

    res.status(200).json({
      message: "Posts fetched successfully",
      result: postsWithFormattedDate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching posts",
      error: error,
    });
  }
}



module.exports = exportRoutes;
