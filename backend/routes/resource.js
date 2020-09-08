const router = require("express").Router();
const Resource = require("../models/resource");
const checkJwt = require("../auth");

router.use("/add", checkJwt, function (req, res, next) {
  next();
});

router.use("/update/:id", checkJwt, function (req, res, next) {
  next();
});

router.use("/delete/:id", checkJwt, function (req, res, next) {
  next();
});

router.route("/add").post((req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const location = req.body.location;
  const date = Date.parse(req.body.date);
  const newResource = new Resource({ title, description, location, date });
  newResource
    .save()
    .then(() => res.json("Resource Added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/").get((req, res) => {
  Resource.find()
    .then((resources) => res.json(resources))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  let id = req.params.id;
  Resource.findById(id)
    .then((resource) => res.json(resource))
    .catch((err) => res.status(400).json("Resource Fetch Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Resource.findById(req.params.id)
    .then((resource) => {
      resource.title = req.body.title;
      resource.description = req.body.description;
      resource.location = req.body.location;
      resource.date = Date.parse(req.body.date);
      resource
        .save()
        .then(() => res.json("Resource Updated"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/delete/:id").delete((req, res) => {
  Resource.findByIdAndDelete(req.params.id)
    .then(() => res.json("Resource deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
