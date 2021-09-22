const db = require("../models");
const User = db.users;

// Create and Save a new User
exports.signup = (req, res) => {
  // Validate request
  if (!req.body.token) {
    res.status(400).send({ message: "Content1 can not be empty!" });
    return;
  }

  // Create a User
  const newUser = new User({
    userID: req.body.token,
    name: req.body.name,
    email: req.body.email,
  });

  // Save User in the database
  // TODO check if user has been previously created, and return 409 if so
  newUser
    .save(newUser)
    .then(() => {
        res.status(201).send({
          message: "User was created successfully!",
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "User creation failed: " + id,
      });
    });
};

exports.login = (req, res) => {
  
  let token = req.body.token;

  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
  }
  verify()
    .then(() => {
      res.cookie("session-token", token);
      res.send("success");
    })
    .catch(console.error);
};
