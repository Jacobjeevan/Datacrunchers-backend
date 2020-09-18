const router = require("express").Router();
const Project = require("../models/project");
const checkJwt = require("../auth");
const jwtAuthz = require("express-jwt-authz");
const checkScopes = jwtAuthz(["all:projects"]);

router.use("/add", checkJwt, checkScopes, function (req, res, next) {
  next();
});

router.use("/update/:id", checkJwt, checkScopes, function (req, res, next) {
  next();
});

router.use("/delete/:id", checkJwt, checkScopes, function (req, res, next) {
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
    .then(() => res.json("Project Added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.get("/", function (req, res) {
  Project.find()
    .then((projects) => res.json(projects))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  let id = req.params.id;
  Project.findById(id)
    .then((project) => res.json(project))
    .catch((err) => res.status(400).json("Project Fetch Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Project.findById(req.params.id)
    .then((project) => {
      project.authors = req.body.authors;
      project.title = req.body.title;
      project.description = req.body.description;
      project.github = req.body.github;
      project
        .save()
        .then(() => res.json("Project Updated"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/delete/:id").delete((req, res) => {
  Project.findByIdAndDelete(req.params.id)
    .then(() => res.json("Project deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
