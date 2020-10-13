const router = require("express").Router();
let Officer = require("./officerModel");
const multer = require("multer");
const AWS = require("aws-sdk");
const checkUserPermissions = require("../auth");
require("dotenv").config();
var upload = multer({ storage: multer.memoryStorage() });
const { successMessage, errorMessage } = require("../routeMessages");

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
        .then(() => successMessage("Officer Added"))
        .catch((error) => errorMessage(res, `Could not add Officer: ${error}`));
    }
  });
});

router.route("/").get((req, res) => {
  Officer.find()
    .then((officers) => res.status(200).json(officers))
    .catch((err) => errorMessage(res, "Officers Fetch Error: " + err));
});

router.route("/:id").get((req, res) => {
  let id = req.params.id;
  Officer.findById(id)
    .then((officer) => res.status(200).json(officer))
    .catch((err) => errorMessage(res, "Officer Fetch Error: " + err));
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
        .then(() => successMessage(res, "Officer Updated"))
        .catch((err) => errorMessage(res, "Error: " + err));
    }
  });
});

router.route("/delete/:id").delete((req, res) => {
  Officer.findByIdAndDelete(req.params.id)
    .then(() => successMessage(res, "Officer Deleted"))
    .catch((err) => errorMessage(res, "Error: " + err));
});

module.exports = router;
