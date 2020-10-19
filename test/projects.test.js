let User = require("../Users/userModel");
let Project = require("../Projects/projectModel");

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
let projectReq = {
  title: "Sample Project",
  description: "This is a sample project thread",
  authors: "Jacob",
  github: "https://github.com/Jacobjeevan",
};
let updateprojectReq = {
  title: "Sample Project Update",
  description: "Something brand new",
  authors: "Jacob",
  github: "https://github.com/Jacobjeevan",
};

describe("Projects", () => {
  describe("Register User", () => {
    it("Should register new user", (done) => {
      // empty projects/users database beforehand;
      Project.deleteMany().then(() => {
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

  describe("/GET projects", () => {
    it("Should get projects", (done) => {
      agent.get("/projects").end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });
  });

  describe("/POST projects - Logged in User", () => {
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

    it("Should add and save a project", (done) => {
      agent
        .post("/projects/add")
        .send(projectReq)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("success");
          res.body.should.have.property("message");
          res.body.success.should.equal(true);
          res.body.message.should.equal("Project Added");
          done();
        });
    });

    it("Should update a project", (done) => {
      Project.findOne({ title: projectReq.title })
        .then((project) => {
          agent
            .post(`/projects/update/${project._id}`)
            .send(updateprojectReq)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property("success");
              res.body.should.have.property("message");
              res.body.success.should.equal(true);
              res.body.message.should.equal("Project Updated");
              done();
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });

    it("Should delete a project", (done) => {
      Project.findOne({ title: updateprojectReq.title })
        .then((project) => {
          agent.delete(`/projects/delete/${project._id}`).end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("success");
            res.body.should.have.property("message");
            res.body.success.should.equal(true);
            res.body.message.should.equal("Project Deleted");
            done();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });

    it("Add project back before unauthenticated checks", (done) => {
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
            .post("/projects/add")
            .send(projectReq)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property("success");
              res.body.should.have.property("message");
              res.body.success.should.equal(true);
              res.body.message.should.equal("Project Added");
            });

          agent.get("/logout").end((err, res) => {
            res.should.have.status(200);
            done();
          });
        });
    });
  });

  describe("/POST projects - Unauthenticated User", () => {
    it("Should not add projects for an unauthenticated user", (done) => {
      agent
        .post("/projects/add")
        .send(projectReq)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property("error");
          res.body.error.should.equal("User not found");
          done();
        });
    });

    it("Should not update projects for an unauthenticated user", (done) => {
      Project.findOne({ title: projectReq.title })
        .then((project) => {
          agent
            .post(`/projects/update/${project._id}`)
            .send(updateprojectReq)
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

    it("Should not delete projects for an unauthenticated user", (done) => {
      Project.findOne({ title: projectReq.title })
        .then((project) => {
          agent.delete(`/projects/delete/${project._id}`).end((err, res) => {
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
