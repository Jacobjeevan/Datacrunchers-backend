const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require("express-jwt");
const jwtAuthz = require("express-jwt-authz");
const jwksRsa = require("jwks-rsa");
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

// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.jwksUri,
  }),

  // Validate the audience and the issuer.
  audience: process.env.audience,
  issuer: process.env.issuer,
  algorithms: ["RS256"],
});

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
