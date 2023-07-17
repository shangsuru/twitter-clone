import { Express } from "express";

export default function routes(app: Express) {
  app.post("/tweets", (req, res) => {
    res.send("Posting a tweet");
  });
  app.get("/tweets", (req, res) => {
    res.send("Retrieving the global feed");
  });
  app.get("/tweets/:userId", (req, res) => {
    res.send("Retrieving the personal feed " + req.params.userId);
  });
  app.get("/users/:userId", (req, res) => {
    res.send("Read profile information " + req.params.userId);
  });
  app.patch("/users/:userId", (req, res) => {
    res.send("Update profile information " + req.params.userId);
  });
  app.patch("/users/:userId/follow", (req, res) => {
    res.send("Follow a user: " + req.params.userId);
  });
  app.patch("/users/:userId/unfollow", (req, res) => {
    res.send("Unfollow a user");
  });
}
