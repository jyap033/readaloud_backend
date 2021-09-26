const db = require("../models");
const User = db.users;
const User_Book = db.user_books;
const Book = db.books;

exports.login = (req, res) => {
 
  // Validate request
  if (!req.body.id) {
    res.status(400).send({ message: "Content1 can not be empty!" });
    return;
  }

  var condition = { _id: req.body.id };
  User.findOne(condition).then(data => {
    if (data) {
      res.status(200).send({ "notifications": data.notifications});
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
};

exports.share = (req, res) => {
  var condition = {_id:req.body.user_id};
  User.findOne(condition).then(ownerUserData =>{
    if (ownerUserData) { 
      // user exists
      condition = {_id:req.body.book_id};
      Book.findOne(condition).then(bookData => {
        if (bookData.owner_user_id == req.body.user_id){ 
          // user is owner of book
          condition = {email:req.body.email};
          User.findOne(condition).then(shareUserData =>{
            if (shareUserData) { 
              // recipient user exists
              const newUserBook = new User_Book({
                user_id: shareUserdata._id,
                book_id: req.body.book_id,
                currentPage: 0,
                bookmarks: []
              });
              // Save User_Book in the database
              newUserBook
                  .save(newUserBook)
                  .then(() => {
                    res.status(201).send({
                      message: "Book was shared successfully!",
                    });
                    // update recipient user notifications
                    var notificationStr = ownerUserData.name + " has shared book \"" + bookData.bookTitle + "\" with you."
                    shareUserData.notifications.push(notificationStr);
                    User.findByIdAndUpdate(shareUserData._id, { $set: {notifications: shareUserData.notifications}}).catch((err) => {
                      console.log(err.message);
                    });
                  })
            }
            else { // user to share to does not exist
              res.status(404).send({
                message:
                  err.message || "Recipient user not found."
              });
            }
          });
        }
        else { // user is not owner of book
          res.status(401).send({
            message:
              err.message || "User is not owner of selected book."
          });
        }
      });
    }
    else { // user does not exist
      res.status(404).send({
        message:
          err.message || "User not found."
      });
    }
  })
  .catch((err) => {
    console.log(err.message);
    res.status(500).send({
      message: "Book sharing failed",
    });
  });
  
}
