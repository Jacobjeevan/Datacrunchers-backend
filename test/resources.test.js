let User = require("../Users/userModel");
let Resource = require("../Resources/resourceModel");

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");

chai.use(chaiHttp);
let agent = chai.request.agent(server);
let should = chai.should();

// defaults
let signUpRequest = {
  username: "test",
  email: "test@email.com",
  password: "testpassword",
};
let loginRequest = {
  username: "test",
  password: "testpassword",
};
let resourceReq = {
  title: "Sample Resource",
  description: "This is a sample resource thread",
};
let updateresourceReq = {
  title: "Sample Resource Update",
  description: "Something brand new",
};

describe("Resources", () => {
  describe("Register User", () => {
    it("Should register new user", (done) => {
      // empty resources/users database beforehand;
      Resource.deleteMany().then(() => {
        User.deleteMany().then(() => {
          agent
            .post("/register")
            .send(signUpRequest)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property("userId");
              res.body.should.have.property("username");
              res.body.username.should.equal(signUpRequest.username);

              User.findOne({ username: signUpRequest.username }).then(
                (user) => {
                  user.id.should.equal(res.body.userId);
                  done();
                }
              );
            });
        });
      });
    });
  });

  describe("/GET resources", () => {
    it("Should get resources", (done) => {
      agent.get("/resources").end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });
  });

  describe("/POST resources - Logged in User", () => {
    beforeEach((done) => {
      agent
        .post("/login")
        .send(loginRequest)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("userId");
          res.body.should.have.property("username");
          res.body.username.should.equal(loginRequest.username);

          User.findOne({ username: loginRequest.username }).then((user) => {
            user.id.should.equal(res.body.userId);
            done();
          });
        });
    });

    afterEach((done) => {
      agent.get("/logout").end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });

    it("Should add and save a resource", (done) => {
      agent
        .post("/resources/add")
        .send(resourceReq)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("success");
          res.body.should.have.property("message");
          res.body.success.should.equal(true);
          res.body.message.should.equal("Resource Added");
          done();
        });
    });

    it("Should update a resource", (done) => {
      Resource.findOne({ title: resourceReq.title })
        .then((resource) => {
          agent
            .post(`/resources/update/${resource._id}`)
            .send(updateresourceReq)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property("success");
              res.body.should.have.property("message");
              res.body.success.should.equal(true);
              res.body.message.should.equal("Resource Updated");
              done();
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });

    it("Should delete a resource", (done) => {
      Resource.findOne({ title: updateresourceReq.title })
        .then((resource) => {
          agent.delete(`/resources/delete/${resource._id}`).end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("success");
            res.body.should.have.property("message");
            res.body.success.should.equal(true);
            res.body.message.should.equal("Resource Deleted");
            done();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });

    it("Add resource back before unauthenticated checks", (done) => {
      agent
        .post("/login")
        .send(loginRequest)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("userId");
          res.body.should.have.property("username");
          res.body.username.should.equal(loginRequest.username);

          User.findOne({ username: loginRequest.username }).then((user) => {
            user.id.should.equal(res.body.userId);
          });

          agent
            .post("/resources/add")
            .send(resourceReq)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property("success");
              res.body.should.have.property("message");
              res.body.success.should.equal(true);
              res.body.message.should.equal("Resource Added");
            });

          agent.get("/logout").end((err, res) => {
            res.should.have.status(200);
            done();
          });
        });
    });
  });

  describe("/POST resources - Unauthenticated User", () => {
    it("Should not add resources for an unauthenticated user", (done) => {
      agent
        .post("/resources/add")
        .send(resourceReq)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property("error");
          res.body.error.should.equal("User not found");
          done();
        });
    });

    it("Should not update resources for an unauthenticated user", (done) => {
      Resource.findOne({ title: resourceReq.title })
        .then((resource) => {
          agent
            .post(`/resources/update/${resource._id}`)
            .send(updateresourceReq)
            .end((err, res) => {
              res.should.have.status(404);
              res.body.should.have.property("error");
              res.body.error.should.equal("User not found");
              done();
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });

    it("Should not delete resources for an unauthenticated user", (done) => {
      Resource.findOne({ title: resourceReq.title })
        .then((resource) => {
          agent.delete(`/resources/delete/${resource._id}`).end((err, res) => {
            res.should.have.status(404);
            res.body.should.have.property("error");
            res.body.error.should.equal("User not found");
            done();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
});
