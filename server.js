const express = require("express"),
  cors = require("cors"),
  mongoose = require("mongoose"),
  helmet = require("helmet"),
  session = require("express-session"),
  passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  User = require("./Users/userModel");

var MongoDBStore = require("connect-mongodb-session")(session);

if (process.env.NODE_ENV == "PRODUCTION") {
  require("dotenv").config({ path: "./.env.prod" });
} else if (process.env.NODE_ENV == "DEV") {
  require("dotenv").config({ path: "./.env.dev" });
}

const officerRouter = require("./Officers/officerRoute");
const eventRouter = require("./Events/eventRoute");
const projectRouter = require("./Projects/projectRoute");
const resourceRouter = require("./Resources/resourceRoute");
const careerRouter = require("./Careers/careerRoute");
const userRouter = require("./Users/userRoute");

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

var store = new MongoDBStore({
  uri: process.env.Session_mongo_URI,
  databaseName: process.env.Session_DB_NAME,
  collection: process.env.Session_collection,
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  },
});

// Catch errors
store.on("error", function (error) {
  console.log(error);
});

let sess = {
  secret: process.env.Session_Secret,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
  name: process.env.Session,
  store: store,
  resave: true,
  saveUninitialized: false,
};

if (process.env.NODE_ENV == "PRODUCTION") {
  sess.cookie.secure = true;
}

app.use(require("express-session")(sess));

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
