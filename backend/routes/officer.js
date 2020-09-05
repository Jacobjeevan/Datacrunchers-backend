const router = require("express").Router();
let Officer = require("../models/officer");

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const title = req.body.title;
  const description = req.body.description;
  const contact = req.body.contact;
  const newOfficer = new Officer({ name, title, description, contact });
  newOfficer
    .save()
    .then(() => res.json("Officer Added"))
    .catch((err) => res.status(400).json("Error: " + err));
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
    .catch((err) => res.status(400).json("Officer Fetch Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Officer.findById(req.params.id)
    .then((officer) => {
      officer.name = req.body.name;
      officer.title = req.body.title;
      officer.description = req.body.description;
      officer.contact = req.body.contact;
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
