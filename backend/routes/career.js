const router = require("express").Router();
const Career = require("../models/career");
const checkJwt = require("../auth");
const jwtAuthz = require("express-jwt-authz");
const checkScopes = jwtAuthz(["all:careers"]);

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
  const title = req.body.title;
  const description = req.body.description;
  const newCareer = new Career({ title, description });
  newCareer
    .save()
    .then(() => res.json("Career Added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/").get((req, res) => {
  Career.find()
    .then((careers) => res.json(careers))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  let id = req.params.id;
  Career.findById(id)
    .then((career) => res.json(career))
    .catch((err) => res.status(400).json("Career Fetch Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Career.findById(req.params.id)
    .then((career) => {
      career.title = req.body.title;
      career.description = req.body.description;
      career
        .save()
        .then(() => res.json("Career Updated"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/delete/:id").delete((req, res) => {
  Career.findByIdAndDelete(req.params.id)
    .then(() => res.json("Career deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
