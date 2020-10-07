const router = require("express").Router();
let Officer = require("./officerModel");
const multer = require("multer");
const AWS = require("aws-sdk");
const checkUserPermissions = require("../auth");
require("dotenv").config();
var upload = multer({ storage: multer.memoryStorage() });

AWS.config.update({
  accessKeyId: process.env.Access_Key_ID,
  secretAccessKey: process.env.Secret_Access_Key,
  region: process.env.bucketregion,
});

const s3 = new AWS.S3();

router.use("/add", checkUserPermissions, function (req, res, next) {
  next();
});

router.use("/update/:id", checkUserPermissions, function (req, res, next) {
  next();
});

router.use("/delete/:id", checkUserPermissions, function (req, res, next) {
  next();
});

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

router.post("/add", upload.single("imageName"), (req, res) => {
  const file = req.file;
  var params = {
    Bucket: process.env.bucketname,
    Body: file.buffer,
    Key: file.originalname,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  s3.upload(params, function (err, data) {
    if (err) {
      return res.status(400).json("S3 Upload Error");
    } else {
      const newOfficer = new Officer({
        name: req.body.name,
        title: req.body.title,
        description: req.body.description,
        email: req.body.email,
        imageDest: data.Location,
      });
      newOfficer
        .save()
        .then(() => res.json("Officer Added"))
        .catch((err) => res.json("Officer Save Error: " + err));
    }
  });
});

router.route("/").get((req, res) => {
  Officer.find()
    .then((officers) => res.json(officers))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  let id = req.params.id;
  Officer.findById(id)
    .then((officer) => res.json(officer))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.post("/update/:id", upload.single("imageName"), (req, res) => {
  const file = req.file;
  let id = req.params.id;
  console.log(id);
  var params = {
    Bucket: process.env.bucketname,
    Body: file.buffer,
    Key: file.originalname,
    ContentType: file.mimetype,
    ACL: "public-read",
  };
  s3.upload(params, function (err, data) {
    if (err) {
      return false;
    } else {
      console.log(id);
      Officer.findByIdAndUpdate(
        { _id: req.params.id },
        {
          name: req.body.name,
          title: req.body.title,
          description: req.body.description,
          email: req.body.email,
          imageDest: data.Location,
        }
      )
        .then(() => res.json("Officer Updated"))
        .catch((err) => res.status(400).json("Error: " + err));
    }
  });
});

router.route("/delete/:id").delete((req, res) => {
  Officer.findByIdAndDelete(req.params.id)
    .then(() => res.json("Officer deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
