const router = require("express").Router();
const Event = require("./eventModel");
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
  const location = req.body.location;
  const date = Date.parse(req.body.date);
  const newEvent = new Event({ title, description, location, date });
  newEvent
    .save()
    .then(() => successMessage("Event Added"))
    .catch((error) => errorMessage(res, `Could not add Event: ${error}`));
});

router.route("/").get((req, res) => {
  Event.find()
    .then((events) => res.status(200).json(events))
    .catch((err) => errorMessage(res, "Events Fetch Error: " + err));
});

router.route("/:id").get((req, res) => {
  let id = req.params.id;
  Event.findById(id)
    .then((event) => res.status(200).json(event))
    .catch((err) => errorMessage(res, "Event Fetch Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Event.findByIdAndUpdate(
    { _id: req.params.id },
    {
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      date: Date.parse(req.body.date),
    }
  )
    .then(() => successMessage(res, "Event Updated"))
    .catch((err) => errorMessage(res, "Error: " + err));
});

router.route("/delete/:id").delete((req, res) => {
  Event.findByIdAndDelete(req.params.id)
    .then(() => successMessage(res, "Event Deleted"))
    .catch((err) => errorMessage(res, "Error: " + err));
});

module.exports = router;
