const db = require("../models");
const BookInfo = db.books_info;
const BookContent = db.books_content;
const UserBooks = db.user_books;
const Book = db.books_info;

// Retrieve all BookTitles(Infos) owned by user from the database.
exports.getAllTitles = async (req, res) => {
  var sharedBooks = [];
  var ownedBooks = [];
  // const token = req.token;
  // const userID = token["sub"];
  const userID = req.query.userid;
  const type = req.query.type;
  console.log("userID:  %s", userID);
  // var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
  var condition = { user_id: userID };

  await UserBooks.find(condition)
    .then((userbooks) => {


      var bar = new Promise(async (resolve) => {

        for (const userbook of userbooks) {
          condition = { _id: userbook.book_id };
          await BookInfo.find(condition).then((bookInfo) => {
            if (bookInfo[0].ownerUserID == userbook.user_id) {
              ownedBooks.push(bookInfo[0]);
              console.log('Owned')
            } else {
              sharedBooks.push(bookInfo[0]);
              console.log('Shared')
            }
          });
        } resolve()

      });

      bar.then(() => {
        // res.send(allbooks)
        if (!type) {
          res.send(userbooks);
        }
        else if (type == "owned") {
          console.log('send Owned')

          res.send(ownedBooks)
        } else if (type == "shared") {
          res.send(sharedBooks)
          console.log('send Shared')
        } else {
          //bad request
          res.status(400).send({
            message: err.message || "Invalid type",
          });
        }
      });

    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving books.",
      });
    });

};


// Find a single Book with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  console.log(id)
  var condition = { bookID: id };

  BookContent.find(condition)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Book with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Book with id=" + id });
    });
};

exports.updateName = (req, res) => {
  var condition = { user_id: req.body.user_id, book_id: req.params.id };
  UserBooks.find(condition).then((data) => {
    if (data) {
      condition = { _id: data[0]._id }
      UserBooks.findByIdAndUpdate(condition, { $set: { book_title: req.body.newBookTitle } })
        .then((data) => {
          res.status(200).send({ message: "Name changed sucessfully" });
        });
    }
    else {
      res.status(500).send({ message: "Error retrieving Book with id=" + req.params.id });
    }
  })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Book with id=" + req.params.id });
    });
};

exports.getProgress = (req, res) => {
  const bookID = req.params.id;
  const userID = req.query.userid;

  console.log(bookID);
  console.log(userID);
  var condition = { book_id: bookID, user_id: userID };

  UserBooks.findOne(condition)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Progress Not found" })
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Progress" });
    });
};


exports.updateProgress = (req, res) => {
  const bookID = req.params.id;
  const userID = req.query.userid;
  const newPage = req.body.current_page;
  const newSentence = req.body.current_sentence;
  console.log(newPage);
  var condition = { book_id: bookID, user_id: userID };

  // MyModel.updateMany({}, { $set: { name: 'foo' } });

  UserBooks.updateOne(condition, { $set: { currentPage: newPage, currentSentence: newSentence } })
    .then((data) => {
      console.log("DEBUG LOG: UPDATE PROGRESS", data);
      if (!data)
        res.status(404).send({ message: "UserBooks Not found" })
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error updating Progress" });
    });
};


// Delete a Book with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  var condition = { _id: id };

  // Check if the user is the owner of the book
  Book.findOne(condition).then(bookData => {
    if (bookData) {
      // If owner requests delete
      if (bookData.ownerUserID == req.query.user_id) {
        console.log("Owner of the book is deleting the book");
        condition = { bookID: id };

        BookContent.deleteOne(condition).then((data) => {
          if (!data) {
            res.status(404).send({
              message: `Cannot delete BookContent with id=${id}. Maybe BookContent was not found!`,
            });
          }
        });

        condition = { _id: id };
        BookInfo.deleteOne(condition).then((data) => {
          if (!data) {
            res.status(404).send({
              message: `Cannot delete BookInfo with id=${id}. Maybe BookInfo was not found!`,
            });
          }
        });

        condition = { book_id: id };
        UserBooks.deleteMany(condition).then((data) => {
          if (!data) {
            res.status(404).send({
              message: `Cannot delete BookInfo with id=${id}. Maybe BookInfo was not found!`,
            });
          } else {
            res.status(204).send();
          }
        });
      } else { // Shared recipient requests delete
        console.log("Shared recipient of the book is deleting the book");
        condition = { book_id: id, user_id: req.query.user_id };
        UserBooks.deleteOne(condition).then((data) => {
          if (!data) {
            res.status(404).send({
              message: `Cannot delete BookInfo with id=${id}. Maybe BookInfo was not found!`,
            });
          } else {
            res.status(204).send();
          }
        });
      }
    } else {
      res.status(404).send({
        message: `Book with id=${id}. not found`
      });
    }
  });

};



//test
// Create and Save a new Book
// exports.create = (req, res) => {
//   // Validate request
//   if (!req.body.title) {
//     res.status(400).send({ message: "Content1 can not be empty!" });
//     return;
//   }

//   // Save Book in the database
//   books
//     .save(books)
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || "Some error occurred while creating the Book.",
//       });
//     });
// };


// exports.getAllBooks = (req, res) => {
//   // const token = req.token;
//   // const userID = token["sub"];
//   const id = req.params.id;
//   // var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
//   var condition = { _id: id };

//   BookInfo.find(condition)
//     .populate({
//       path: "chapters",

//       populate: { path: "pages" },
//     })
//     .exec(function (err, books) {
//       if (err) return handleError(err);
//       books.forEach((entry) => {
//         console.log("entry:  %s", entry);
//         entry.chapters[0].pages.forEach((page) => {
//           console.log("page: %s", page);
//         });
//       });
//       console.log("Result:  %s", books);
//       res.send(books);
//     });
// };


// // Update a Book by the id in the request
// exports.update = (req, res) => {
//   if (!req.body) {
//     return res.status(400).send({
//       message: "Data to update can not be empty!",
//     });
//   }

//   const id = req.params.id;

//   Book.findByIdAndUpdate(id, req.body)
//     .then((data) => {
//       if (!data) {
//         res.status(404).send({
//           message: `Cannot update Book with id=${id}. Maybe Book was not found!`,
//         });
//       } else res.send({ message: "Book was updated successfully." });
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: "Error updating Notes with id=" + id,
//       });
//     });
// };


// Delete all Book from the database.
// exports.deleteAll = (req, res) => {
//   Book.deleteMany({})
//     .then((data) => {
//       res.send({
//         message: `${data.deletedCount} Notes were deleted successfully!`,
//       });
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || "Some error occurred while removing all Notes.",
//       });
//     });
// };
