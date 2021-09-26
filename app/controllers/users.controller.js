const db = require("../models");
const User = db.users;

exports.login = (req, res) => {
  
  let token = req.body.id;
  // Validate request
  if (!req.body.id) {
    res.status(400).send({ message: "Content1 can not be empty!" });
    return;
  }

  var condition = { _id: req.body.id };
  User.find(condition).then(data => {
    if (data.length != 0) {
      res.status(200).send({ "notifications": data[0].notifications});
      User.findByIdAndUpdate(condition, { $set: { notifications: [] }}).catch((err) => {
        console.log(err.message);
      });
    }
    else {
      // Create a User
      const newUser = new User({
        _id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        notifications: []
      });

      // Save User in the database
      newUser
        .save(newUser)
        .then(() => {
          res.status(201).send({
            message: "User was created successfully!",
          });
        })
      .catch((err) => {
        console.log(err.message);
        res.status(500).send({
          message: "User creation failed: " + req.body.id,
        });
      });
    }
  })
  .catch(err => {
    console.error(err);
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving books."
    });
  });

  
  /*
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
  */
};
