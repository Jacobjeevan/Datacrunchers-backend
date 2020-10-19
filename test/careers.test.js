let User = require("../Users/userModel");
let Career = require("../Careers/careerModel");

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
let careerReq = {
  title: "Sample Career",
  description: "This is a sample career thread",
};
let updatecareerReq = {
  title: "Sample Career Update",
  description: "Something brand new",
};

describe("Careers", () => {
  describe("Register User", () => {
    it("Should register new user", (done) => {
      // empty careers/users database beforehand;
      Career.deleteMany().then(() => {
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

  describe("/GET careers", () => {
    it("Should get careers", (done) => {
      agent.get("/careers").end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });
  });

  describe("/POST careers - Logged in User", () => {
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

    it("Should add and save a career", (done) => {
      agent
        .post("/careers/add")
        .send(careerReq)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("success");
          res.body.should.have.property("message");
          res.body.success.should.equal(true);
          res.body.message.should.equal("Career Prep Resource Added");
          done();
        });
    });

    it("Should update a career", (done) => {
      Career.findOne({ title: careerReq.title })
        .then((career) => {
          agent
            .post(`/careers/update/${career._id}`)
            .send(updatecareerReq)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property("success");
              res.body.should.have.property("message");
              res.body.success.should.equal(true);
              res.body.message.should.equal("Career Updated");
              done();
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });

    it("Should delete a career", (done) => {
      Career.findOne({ title: updatecareerReq.title })
        .then((career) => {
          agent.delete(`/careers/delete/${career._id}`).end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("success");
            res.body.should.have.property("message");
            res.body.success.should.equal(true);
            res.body.message.should.equal("Career Deleted");
            done();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });

    it("Add career back before unauthenticated checks", (done) => {
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
            .post("/careers/add")
            .send(careerReq)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property("success");
              res.body.should.have.property("message");
              res.body.success.should.equal(true);
              res.body.message.should.equal("Career Prep Resource Added");
            });

          agent.get("/logout").end((err, res) => {
            res.should.have.status(200);
            done();
          });
        });
    });
  });

  describe("/POST careers - Unauthenticated User", () => {
    it("Should not add careers for an unauthenticated user", (done) => {
      agent
        .post("/careers/add")
        .send(careerReq)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property("error");
          res.body.error.should.equal("User not found");
          done();
        });
    });

    it("Should not update careers for an unauthenticated user", (done) => {
      Career.findOne({ title: careerReq.title })
        .then((career) => {
          agent
            .post(`/careers/update/${career._id}`)
            .send(updatecareerReq)
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

    it("Should not delete careers for an unauthenticated user", (done) => {
      Career.findOne({ title: careerReq.title })
        .then((career) => {
          agent.delete(`/careers/delete/${career._id}`).end((err, res) => {
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
