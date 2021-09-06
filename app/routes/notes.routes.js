module.exports = app => {
    const notes = require("../controllers/notes.controller.js");
  
    var router = require("express").Router();
  
    // Create a new notes
    router.post("/", notes.create);
  
    // Retrieve all notes
    router.get("/", notes.findAll);
  
 
  
    // Retrieve a single notes with id
    router.get("/:id", notes.findOne);
  
    // Update a notes with id
    router.put("/:id", notes.update);
  
    // Delete a notes with id
    router.delete("/:id", notes.delete);
  
    // delete notes
    router.delete("/", notes.deleteAll);
  
    app.use('/api/notes', router);
  };