const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const officerRouter = require("./routes/officer");
const eventRouter = require("./routes/event");
const projectRouter = require("./routes/project");
const resourceRouter = require("./routes/resource");
const careerRouter = require("./routes/career");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/officers", officerRouter);
app.use("/projects", projectRouter);
app.use("/events", eventRouter);
app.use("/resources", resourceRouter);
app.use("/careers", careerRouter);

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established succesfully");
});

app.listen(port, () => {
  console.log(`Server is currently running on the port: ${port}`);
});
