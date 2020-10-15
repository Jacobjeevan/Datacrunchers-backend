const router = require("express").Router();
const Resource = require("./resourceModel");
const checkUserPermissions = require("../auth");
const { successMessage, errorMessage } = require("../routeMessages");

router.use("/add", checkUserPermissions, function (req, res, next) {
  next();
});

router.use("/update/:id", checkUserPermissions, function (req, res, next) {
  next();
});

router.use("/delete/:id", checkUserPermissions, function (req, res, next) {
  next();
});

router.route("/add").post((req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const newResource = new Resource({ title, description });
  newResource
    .save()
    .then(() => successMessage(res, "Resource Added"))
    .catch((error) => errorMessage(res, `Could not add Resource: ${error}`));
});

router.route("/").get((req, res) => {
  Resource.find()
    .then((resources) => res.json(resources))
    .catch((err) => errorMessage(res, "Resources Fetch Error: " + err));
});

router.route("/:id").get((req, res) => {
  let id = req.params.id;
  Resource.findById(id)
    .then((resource) => res.json(resource))
    .catch((err) => errorMessage(res, "Resource Fetch Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Resource.findByIdAndUpdate(
    { _id: req.params.id },
    {
      title: req.body.title,
      description: req.body.description,
    }
      .then(() => successMessage(res, "Resource Updated"))
      .catch((err) => errorMessage(res, "Error: " + err))
  );
});

router.route("/delete/:id").delete((req, res) => {
  Resource.findByIdAndDelete(req.params.id)
    .then(() => successMessage(res, "Resource Deleted"))
    .catch((err) => errorMessage(res, "Error: " + err));
});

module.exports = router;
