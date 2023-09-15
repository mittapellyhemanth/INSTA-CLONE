const express = require('express');
require('dotenv').config()
const app = express();
const bodyParser = require('body-parser')
// const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const methodOverride = require('method-override')
const PostModel = require('../Models/post')
app.use(bodyParser.json())
const cors = require("cors");
app.use(cors());
app.use(methodOverride('_method'))
// app.set('view engine', 'ejs');
const mongoose = require('mongoose')
const router = require('../routers/PostRouter')

app.use(express.urlencoded({extended: true}));
const URL = process.env.DB_URL

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Handle MongoDB connection errors
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
// const connect = mongoose.createConnection(URL)
// mongoose.connect(URL).then((res)=>
// console.log('DB connected Sucessfully'))
// .catch(err=>console.log(err))

// Init gfs

let gfs

db.once('open',  () => {
  console.log("db connected")
  gfs = Grid(db, mongoose.mongo);
gfs.collection('uploads')
  // all set!
})

// create storage engine 

const storage = new GridFsStorage({
    url: URL,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
          const filename = file.originalname;
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
      });
    }
  });

  const upload = multer({ storage });
// router get /
//load form

// app.get('/',(req,res)=>{
//     res.status(201).json({message:'hiii'})
// })

// router post  /upload
//upload fileto db
 
// app.use('/',upload.single('PostImage'),router);


app.post('/posts', upload.single('PostImage'), async (req, res) => {
  console.log(req.file.filename)
  console.log(req.file)
  try {
    const post = new PostModel({
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
});



// app.get('/files',(req,res)=>{
//     gfs.files.find().toArray((err,files)=>{
//         //check if files
//         if(!files || files.length === 0){
//             return res.status(404).json({
//                 err:'no files exists'
//             });
//         }
//         return res.json(files);
//     });
// });



app.listen(process.env.PORT,console.log('port connnected'))