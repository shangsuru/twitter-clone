let expect = require("chai").expect;
import request from "supertest";
import Dynamo from "../models/Dynamo";
import app from "../app";

describe("Users", () => {
  afterEach(async function () {
    await Dynamo.query("type")
      .eq("USER")
      .and()
      .where("handle")
      .eq("helm.henry99")
      .exec()
      .then((res) => {
        res.forEach((user) => {
          Dynamo.delete(user);
        });
      });
  });

  it("POST /users/profile should create a new user", (done) => {
    request(app)
      .post("/backend/users/profile")
      .send({
        handle: "helm.henry99",
        username: "Henry Helm",
        image: "https://avatars.githubusercontent.com/u/77449822?v=4",
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("object");
        expect(res.body.handle).to.equal("helm.henry99");
        expect(res.body.username).to.equal("Henry Helm");
        expect(res.body.image).to.equal(
          "https://avatars.githubusercontent.com/u/77449822?v=4"
        );
        done();
      });
  });
});

describe("Tweets", () => {
  describe("GET /backend/tweets", () => {
    it("should get all tweets", (done) => {
      request(app)
        .get("/backend/tweets")
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an("array");
          expect(res.body.length).to.be.equal(5);
          done();
        });
    });
  });

  describe("GET /backend/tweets", () => {
    it("tweets should be sorted by creation date", (done) => {
      request(app)
        .get("/backend/tweets")
        .end((err, res) => {
          for (let i = 0; i < res.body.length - 1; i++) {
            expect(res.body[i].createdAt).to.be.greaterThan(
              res.body[i + 1].createdAt
            );
          }
          done();
        });
    });
  });
});
