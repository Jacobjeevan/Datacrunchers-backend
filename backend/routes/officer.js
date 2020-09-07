const router = require("express").Router();
let Officer = require("../models/officer");
const multer = require("multer");
const AWS = require("aws-sdk");
const fs = require("fs");
require("dotenv").config();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

AWS.config.update({
  accessKeyId: process.env.Access_Key_ID,
  secretAccessKey: process.env.Secret_Access_Key,
  region: process.env.bucketregionregion,
});

const s3 = new AWS.S3();

router.route("/add", upload.single("headshot")).post((req, res) => {
  const name = req.body.name;
  const title = req.body.title;
  const description = req.body.description;
  const contact = req.body.contact;
  const imageName = req.file.filename;
  const uploadRes = uploadFile(req.file.path, imageName);
  if (uploadRes === false) {
    res.status(400).json("Image upload Error");
  }
  const newOfficer = new Officer({
    name,
    title,
    description,
    contact,
    imageName,
  });
  newOfficer
    .save()
    .then(() => res.json("Officer Added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

function uploadFile(source, targetName) {
  fs.readFile(source, function (err, filedata) {
    if (!err) {
      const putParams = {
        Bucket: process.env.bucketregion,
        Key: targetName,
        Body: filedata,
      };
      s3.putObject(putParams, function (err, data) {
        if (err) {
          return false;
        } else {
          fs.unlink(source);
          return true;
        }
      });
    } else {
      console.log({ err: err });
      return false;
    }
  });
}

router.route("/").get((req, res) => {
  Officer.find()
    .then((officers) => {
      officers.map(function callback(officer) {
        officer.image = retrieveFile(officer.imageName);
        if (officer.image === false) {
          res.status(400).json("Image retrieval Error");
        } else {
          return officer;
        }
      });

      res.json(officers);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

function retrieveFile(filename) {
  const getParams = {
    Bucket: process.env.bucketregion,
    Key: filename,
  };

  s3.getObject(getParams, function (err, data) {
    if (err) {
      return false;
    } else {
      return data.Body;
    }
  });
}

router.route("/:id").get((req, res) => {
  let id = req.params.id;
  Officer.findById(id)
    .then((officer) => {
      officer.image = retrieveFile(officer.imageName);
      if (officer.image === false) {
        res.status(400).json("Image retrieval Error");
      }
      res.json(officer);
    })
    .catch((err) => res.status(400).json("Officer Fetch Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Officer.findById(req.params.id)
    .then((officer) => {
      officer.name = req.body.name;
      officer.title = req.body.title;
      officer.description = req.body.description;
      officer.contact = req.body.contact;
      officer.imageName = req.body.imageName;
      officer
        .save()
        .then(() => res.json("Officer Updated"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Officer.findByIdAndDelete(req.params.id)
    .then(() => res.json("Officer deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
