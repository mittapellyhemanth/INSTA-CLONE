const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const path = require("path");
const { GridFsStorage } = require("multer-gridfs-storage");
const multer = require("multer");
const router = express.Router();
const Grid = require("gridfs-stream");

const URL = process.env.DB_URL;

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
let gfs, gridfsBucket;
db.once("open", () => {
  console.log("db connected");
  gridfsBucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: process.env.BUCKET_NAME,
  });

  gfs = Grid(db, mongoose.mongo);
  gfs.collection(process.env.BUCKET_NAME);
});

const storage = new GridFsStorage({
  url: URL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: process.env.BUCKET_NAME,
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

const postController = require("../controllers/postControllers");

router.post("/posts", upload.single("PostImage"), postController.post);

router.get("/getPosts", postController.get);

// router to download and display images
router.get("/images/:filename", (req, res) => {
  const filename = req.params.filename.toString();
  gfs.files.findOne({ filename: filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({
        error: err + "No files exist",
      });
    }
    //  return res.json(file)
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      const readStream = gridfsBucket.openDownloadStream(file._id);
      readStream.pipe(res);
    } else {
      return res.status(404).json({
        err: "No image exists",
      });
    }
  });
});

module.exports = router;
