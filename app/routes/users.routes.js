module.exports = app => {
    const users = require("../controllers/users.controller.js");
  
    var router = require("express").Router();

    router.post("/login", users.login);

    router.post("/share", users.share);

    router.put('/bookmark', users.addBookmark);

    router.delete('/bookmark', users.removeBookmark);

    app.use('/api/users', router);
  };