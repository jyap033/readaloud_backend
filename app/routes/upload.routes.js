const multer = require("multer");
const upload = multer({ dest: "uploads/" });


module.exports = app => {
    const uploader = require("../controllers/upload.controller.js");
  
    var router = require("express").Router();
  
    // Create a new notes
    router.post("/", upload.single("pdf"), uploader.upload);
  

    app.use('/api/upload', router);
  };