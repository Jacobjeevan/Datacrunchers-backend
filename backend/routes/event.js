const router = require("express").Router();
const Event = require("../models/event");

router.route("/add").post((req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const location = req.body.location;
  const date = Date.parse(req.body.date);
  const newEvent = new Event({ title, description, location, date });
  newEvent
    .save()
    .then(() => res.json("Event Added"))
    .catch((err) => res.status(400).json("Error: " + err));
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
        .then(() => res.json("Event Updated"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Event.findByIdAndDelete(req.params.id)
    .then(() => res.json("Event deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
