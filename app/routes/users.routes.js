module.exports = app => {
    const users = require("../controllers/users.controller.js");
  
    var router = require("express").Router();
  
    // Sign up for a new user
    router.post("/signup", users.signup);

    // Login for existing users
    router.get("/login", users.login);
  
    app.use('/api/users', router);
  };