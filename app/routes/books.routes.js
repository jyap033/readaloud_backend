module.exports = app => {
    const books = require("../controllers/books.controller.js");
  
    var router = require("express").Router();
  
    // Create a new books
    // router.post("/", books.create);
  
    // Retrieve all books
    // router.get("/", books.getAllBooks);

    
    router.get("/titles", books.getAllTitles);
  
    router.get("/:id", books.findOne);

    router.put("/:id", books.updateName);

    router.get("/:id/progress", books.getProgress);

    router.put("/:id/progress", books.updateProgress);
  
    // Delete a books with id
    router.delete("/:id", books.delete);
  
    app.use('/api/audiobooks', router);
  };