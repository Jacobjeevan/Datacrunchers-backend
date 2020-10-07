const router = require("express").Router();
const Event = require("./eventModel");
const checkUserPermissions = require("../auth");

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
    .then(() => res.json({ success: true, message: "Event Added" }))
    .catch((error) =>
      res
        .status(400)
        .json({ success: false, message: `Could not add Event: ${error}` })
    );
});

router.route("/").get((req, res) => {
  Event.find()
    .then((events) => res.json(events))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  let id = req.params.id;
  Event.findById(id)
    .then((event) => res.json(event))
    .catch((err) => res.status(400).json("Event Fetch Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Event.findById(req.params.id)
    .then((event) => {
      event.title = req.body.title;
      event.description = req.body.description;
      event.location = req.body.location;
      event.date = Date.parse(req.body.date);
      event
        .save()
        .then(() => res.json({ success: true, message: "Event Updated" }))
        .catch((error) =>
          res.status(400).json({
            success: false,
            message: `Could not update Event: ${error}`,
          })
        );
    })
    .catch((err) =>
      res
        .status(400)
        .json({ success: false, message: `Could not update Event: ${error}` })
    );
});

router.route("/delete/:id").delete((req, res) => {
  Event.findByIdAndDelete(req.params.id)
    .then(() => res.json({ success: true, message: "Event Deleted" }))
    .catch((error) =>
      res.status(400).json({
        success: false,
        message: `Could not delete Event: ${error}`,
      })
    );
});

module.exports = router;
