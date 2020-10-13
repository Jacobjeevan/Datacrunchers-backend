const router = require("express").Router();
const Career = require("./careerModel");
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
  const newCareer = new Career({ title, description });
  newCareer
    .save()
    .then(() => successMessage(res, "Career Prep Resource Added"))
    .catch((error) =>
      errorMessage(res, `Could not add Career Prep Resource: ${error}`)
    );
});

router.route("/").get((req, res) => {
  Career.find()
    .then((careers) => res.status(200).json(careers))
    .catch((err) => errorMessage(res, "Careers Fetch Error: " + err));
});

router.route("/:id").get((req, res) => {
  let id = req.params.id;
  Career.findById(id)
    .then((career) => res.status(200).json(career))
    .catch((err) => errorMessage(res, "Career Fetch Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Career.findByIdAndUpdate(
    { _id: req.params.id },
    {
      title: req.body.title,
      description: req.body.description,
    }
  )
    .then(() => successMessage(res, "Career Updated"))
    .catch((err) => errorMessage(res, "Error: " + err));
});

router.route("/delete/:id").delete((req, res) => {
  Career.findByIdAndDelete(req.params.id)
    .then(() => successMessage(res, "Career deleted"))
    .catch((err) => errorMessage(res, "Error: " + err));
});

module.exports = router;
