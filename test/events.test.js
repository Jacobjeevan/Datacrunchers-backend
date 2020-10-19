let User = require("../Users/userModel");
let Event = require("../Events/eventModel");

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
let eventReq = {
  title: "Sample Event",
  description: "This is a sample event thread",
  location: "UH 2000",
  date: "09/27/2020",
};
let updateeventReq = {
  title: "Sample Event Update",
  description: "Something brand new",
  location: "UH 2000",
  date: "09/27/2020",
};

describe("Events", () => {
  describe("Register User", () => {
    it("Should register new user", (done) => {
      // empty events/users database beforehand;
      Event.deleteMany().then(() => {
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

  describe("/GET events", () => {
    it("Should get events", (done) => {
      agent.get("/events").end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });
  });

  describe("/POST events - Logged in User", () => {
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

    it("Should add and save a event", (done) => {
      agent
        .post("/events/add")
        .send(eventReq)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("success");
          res.body.should.have.property("message");
          res.body.success.should.equal(true);
          res.body.message.should.equal("Event Added");
          done();
        });
    });

    it("Should update a event", (done) => {
      Event.findOne({ title: eventReq.title })
        .then((event) => {
          agent
            .post(`/events/update/${event._id}`)
            .send(updateeventReq)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property("success");
              res.body.should.have.property("message");
              res.body.success.should.equal(true);
              res.body.message.should.equal("Event Updated");
              done();
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });

    it("Should delete a event", (done) => {
      Event.findOne({ title: updateeventReq.title })
        .then((event) => {
          agent.delete(`/events/delete/${event._id}`).end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("success");
            res.body.should.have.property("message");
            res.body.success.should.equal(true);
            res.body.message.should.equal("Event Deleted");
            done();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });

    it("Add event back before unauthenticated checks", (done) => {
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
            .post("/events/add")
            .send(eventReq)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property("success");
              res.body.should.have.property("message");
              res.body.success.should.equal(true);
              res.body.message.should.equal("Event Added");
            });

          agent.get("/logout").end((err, res) => {
            res.should.have.status(200);
            done();
          });
        });
    });
  });

  describe("/POST events - Unauthenticated User", () => {
    it("Should not add events for an unauthenticated user", (done) => {
      agent
        .post("/events/add")
        .send(eventReq)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property("error");
          res.body.error.should.equal("User not found");
          done();
        });
    });

    it("Should not update events for an unauthenticated user", (done) => {
      Event.findOne({ title: eventReq.title })
        .then((event) => {
          agent
            .post(`/events/update/${event._id}`)
            .send(updateeventReq)
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

    it("Should not delete events for an unauthenticated user", (done) => {
      Event.findOne({ title: eventReq.title })
        .then((event) => {
          agent.delete(`/events/delete/${event._id}`).end((err, res) => {
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
