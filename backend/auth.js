const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
require("dotenv").config();

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

module.exports = checkJwt;
