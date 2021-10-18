const db = require("../models");
const BookInfo = db.books_info;
const BookContent = db.books_content;
const UserBooks = db.user_books;
const Book = db.books_info;
const User = db.users;

// Retrieve all BookTitles(Infos) owned by & shared to the user.
exports.getAllTitles = async (req, res) => {
  var sharedBooks = [];
  var ownedBooks = [];
  const userID = req.query.userid;
  console.log("userID:  %s", userID);
  var condition = { user_id: userID };

  await UserBooks.find(condition)
    .then((userbooks) => {
      var bar = new Promise(async (resolve) => {

        for (const userbook of userbooks) {
          condition = { _id: userbook.book_id };
          await BookInfo.find(condition).then((bookInfo) => {
            let renamed = {
              'title': userbook.book_title,
              ...bookInfo[0]['_doc']
            }
            renamed['book_id'] = renamed['_id'];
            delete renamed['_id'];

            //Push Userbook to shared/owned array
            if (bookInfo[0].ownerUserID == userbook.user_id) {
              ownedBooks.push(renamed);
              console.log('Owned')
            } else {
              sharedBooks.push(renamed);
              console.log('Shared')
            }
          });
        } resolve()
      });

      bar.then(() => {
        res.send({ "OwnedBooks": ownedBooks, "SharedBooks": sharedBooks });
      });

    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving books.",
      });
    });

};

// Find a specified Book and its contents
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

// Update the name of the specified Book
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

//Get the progress of the specifed user and book.
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

//Update the progress of the specifed user and book.
exports.updateProgress = (req, res) => {
  const bookID = req.params.id;
  const userID = req.query.userid;
  const newPage = req.body.current_page;
  const newSentence = req.body.current_sentence;
  console.log(newPage);
  var condition = { book_id: bookID, user_id: userID };

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
  var ownerUserData;
  // Check if the user is the owner of the book
  Book.findOne(condition).then(bookData => {
    if (bookData) {
      // If owner requests delete
      if (bookData.ownerUserID == req.query.user_id) {
        User.findOne({ _id: req.query.user_id }).then((data) => ownerUserData = data);

        console.log("Owner of the book is deleting the book");
        condition = { bookID: id };

        BookContent.deleteOne(condition).then((data) => {
          if (data.n != 1) {
            res.status(404).send({ message: `Cannot delete BookContent with id=${id}. Book was not found!` });
          }
        }).catch((err) => {
          res.status(500).send({ message: `DB server internal error` });
        });

        condition = { _id: id };
        BookInfo.deleteOne(condition).then((data) => {
          if (data.n != 1) {
            res.status(404).send({ message: `Cannot delete BookInfo with id=${id}. Book was not found!` });
          }
        }).catch((err) => {
          res.status(500).send({ message: `DB server internal error` });
        });

        condition = { book_id: id };
        UserBooks.find(condition)
          .then((userbooks) => {
            for (const userbook of userbooks) {
              if (userbook.user_id != req.query.user_id) {
                condition = { _id: userbook.user_id }
                User.findOne(condition).then((sharedUserData) => {
                  console.log("Updating recipient user notifications...");
                  console.log(sharedUserData);
                  // update recipient user notifications
                  var notificationStr = ownerUserData.name + " has deleted the shared book \"" + bookData.pdfName + "\".";
                  sharedUserData.notifications.push(notificationStr);
                  console.log("Notifications : \n", sharedUserData.notifications);
                  User.findByIdAndUpdate(sharedUserData._id, { $set: { notifications: sharedUserData.notifications } }).catch((err) => {
                    console.log(err.message);
                  });
                });
              }
            }
          });
        condition = { book_id: id };
        UserBooks.deleteMany(condition).then((data) => {
          console.log(data);
          if (data.n != 0) {
            res.status(204).send();
          } else {
            res.status(404).send({ message: `Cannot delete UserBooks with id=${id}. Book was not found!` });
          }
        }).catch((err) => {
          res.status(500).send({ message: `DB server internal error` });
        });
      } else { // Shared recipient requests delete
        console.log("Shared recipient of the book is deleting the book");
        condition = { book_id: id, user_id: req.query.user_id };
        UserBooks.deleteOne(condition).then((data) => {
          if (data.n == 1) {
            res.status(204).send();
          } else {
            res.status(404).send({ message: `Cannot delete BookInfo with id=${id}. Book was not found!` });
          }
        }).catch((err) => {
          res.status(500).send({ message: `DB server internal error` });
        });
      }
    }
  }).catch((err) => {
    res.status(404).send({ message: `Book with id=${id}. not found` });
  });

};