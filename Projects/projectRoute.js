const router = require("express").Router();
const Project = require("./projectModel");
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
  const authors = req.body.authors;
  const title = req.body.title;
  const description = req.body.description;
  const github = req.body.github;
  const newProject = new Project({ authors, title, description, github });
  newProject
    .save()
    .then(() => successMessage("Project Added"))
    .catch((error) => errorMessage(res, `Could not add Project: ${error}`));
});

router.get("/", function (req, res) {
  Project.find()
    .then((projects) => res.status(200).json(projects))
    .catch((err) => errorMessage(res, "Projects Fetch Error: " + err));
});

router.route("/:id").get((req, res) => {
  let id = req.params.id;
  Project.findById(id)
    .then((project) => res.status(200).json(project))
    .catch((err) => errorMessage(res, "Project Fetch Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Project.findByIdAndUpdate(
    { _id: req.params.id },
    {
      authors: req.body.authors,
      title: req.body.title,
      description: req.body.description,
      github: req.body.github,
    }
  )
    .then(() => successMessage(res, "Project Updated"))
    .catch((err) => errorMessage(res, "Error: " + err));
});

router.route("/delete/:id").delete((req, res) => {
  Project.findByIdAndDelete(req.params.id)
    .then(() => successMessage(res, "Project Deleted"))
    .catch((err) => errorMessage(res, "Error: " + err));
});

module.exports = router;
