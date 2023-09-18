const express = require('express');
const mongoose = require('mongoose');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const PostModel = require('../Models/post')
const app = express();
const crypto = require('crypto');
const path = require('path');
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');


const URL = process.env.DB_URL;

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});



let gfs, gridfsBucket;
  db.once('open', () => {
    console.log("db connected")
   gridfsBucket = new mongoose.mongo.GridFSBucket(db, {
   bucketName: process.env.BUCKET_NAME
 });

   gfs = Grid(db, mongoose.mongo);
   gfs.collection(process.env.BUCKET_NAME);
})

const storage = new GridFsStorage({
  url: URL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: process.env.BUCKET_NAME
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });

app.post('/posts', upload.single('PostImage'), async (req, res) => {
  try {
   
    const post = new PostModel({
      ...req.body,
      date:new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }),
      PostImage: req.file.filename,
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
});

app.get('/getPosts', async (req, res) => {
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

app.get('/images/:filename', (req, res) => {
 
const filename = req.params.filename.toString();
  gfs.files.findOne({ filename: filename }, (err, file) => {
   
    if (!file || file.length === 0) {
      return res.status(404).json({
        error :err + 'No files exist',
      });
    }
  //  return res.json(file)
  if(file.contentType === 'image/jpeg' || file.contentType ==='image/png') 
  {
     const readStream = gridfsBucket.openDownloadStream(file._id);
     readStream.pipe(res);
  }
    else {
      return res.status(404).json({
        err: 'No image exists',
      });
    }
  });
});


app.listen(process.env.PORT, () => console.log('Server connected on port', process.env.PORT));
