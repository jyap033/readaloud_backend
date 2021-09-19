const db = require("../models");
const Book = db.books;
//test
// Create and Save a new Book
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content1 can not be empty!" });
    return;
  }

  // Create a Book
  const books = new Book({
    title: req.body.title,
    imageURL: req.body.imageURL,
    ingredient: req.body.ingredient,
    instruction: req.body.instruction,
    amount: req.body.amount,
    ingredientList: req.body.ingredientList,
    instructionList: req.body.instructionList,
  });

  // Save Book in the database
  books
    .save(books)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Book.",
      });
    });
};

// Retrieve all Book from the database.
exports.getAllTitles = (req, res) => {
  // const token = req.token;
  // const userID = token["sub"];
  const userID = "Test";

  // var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
  var condition = { userID: userID };

  Book.find(condition).then(data => {
    res.send(data);
  })
  .catch(err => {
    console.error(err);
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving books."
    });
  });
    

      // prints "The author is Ian Fleming"
 
};

exports.getAllBooks = (req, res) => {
  // const token = req.token;
  // const userID = token["sub"];
  const userID = "Test";

  // var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
  var condition = { userID: userID };

  Book.find(condition)
    .populate({
      path: "chapters",
      // Get friends of friends - populate the 'friends' array for every friend
      populate: { path: "pages" },
    })
    .exec(function (err, books) {
      if (err) return handleError(err);
      books.forEach((entry) => {
        console.log("entry:  %s", entry);
        entry.chapters[0].pages.forEach((page) => {console.log("page: %s",page);});
      });
      console.log("Result:  %s", books);
      res.send(books);

      // prints "The author is Ian Fleming"
    });
};

// .catch((err) => {
//   res.status(500).send({
//     message: err.message || "Some error occurred while retrieving books.",
//   });
// });

// Find a single Book with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Book.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Book with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Book with id=" + id });
    });
};

// Update a Book by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Book.findByIdAndUpdate(id, req.body)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Book with id=${id}. Maybe Book was not found!`,
        });
      } else res.send({ message: "Book was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Notes with id=" + id,
      });
    });
};

// Delete a Book with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Book.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Book with id=${id}. Maybe Book was not found!`,
        });
      } else {
        res.send({
          message: "Book was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Book with id=" + id,
      });
    });
};

// Delete all Book from the database.
exports.deleteAll = (req, res) => {
  Book.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Notes were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Notes.",
      });
    });
};
