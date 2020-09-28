const express = require("express"),
  cors = require("cors"),
  mongoose = require("mongoose"),
  helmet = require("helmet"),
  session = require("express-session"),
  passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  User = require("./models/user");

require("dotenv").config();

const officerRouter = require("./routes/officer");
const eventRouter = require("./routes/event");
const projectRouter = require("./routes/project");
const resourceRouter = require("./routes/resource");
const careerRouter = require("./routes/career");
const userRouter = require("./routes/users");

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", userRouter);
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
