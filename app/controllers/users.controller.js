const db = require("../models");
var mongoose = require('mongoose');
const User = db.users;
const User_Book = db.user_books;
const Book = db.books_info;

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
        if (bookData.ownerUserID == req.body.user_id){ 
          // user is owner of book
          condition = {email:req.body.email};
          User.findOne(condition).then(shareUserData =>{
            if (shareUserData) { 
              // recipient user exists
              condition = {user_id:shareUserData._id, book_id:bookData._id};
              User_Book.findOne(condition).then(existsCheck => {
                if (!existsCheck){
                  // book has not been shared previously
                    const newUserBook = new User_Book({
                      user_id: shareUserData._id,
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
                          var notificationStr = ownerUserData.name + " has shared book \"" + bookData.bookTitle + "\" with you.";
                          shareUserData.notifications.push(notificationStr);
                          User.findByIdAndUpdate(shareUserData._id, { $set: {notifications: shareUserData.notifications}}).catch((err) => {
                            console.log(err.message);
                          });
                        })
                }
                else {
                  res.status(404).send({
                    message:
                      "Book already shared with recipient user"
                  });
                }
              });
              
            }
            else { // user to share to does not exist
              res.status(404).send({
                message:
                  "Recipient user not found."
              });
            }
          });
        }
        else { // user is not owner of book
          res.status(401).send({
            message:
              "User is not owner of selected book."
          });
        }
      });
    }
    else { // user does not exist
      res.status(404).send({
        message:
          "User not found."
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
exports.addBookmark = (req, res) => {
  condition = {user_id:req.body.user_id , book_id:mongoose.Types.ObjectId(req.body.book_id)};
  User_Book.findOne(condition).then(bookData => {
    if (!bookData){
      res.status(404).send({
        message: "User_Book not found",
      });
      return;
    }
    /*bookData.bookmarks.forEach(bkmark => {
      if (bkmark.name == req.body.name){
        res.status(409).send({
          message: "Bookmark with same name already exists",
        });
        return;
      }
    });*/
    var newBookmark = {
      "name": req.body.name,
      "page": req.body.page
    }
    bookData.bookmarks.push(newBookmark);
    User_Book.findByIdAndUpdate(bookData._id, {$set: {bookmarks:bookData.bookmarks}}).catch((err) => {
      console.log(err.message);
    });
    res.status(201).send({
      bookmarks: bookData.bookmarks
    });
  })
  .catch((err) => {
    console.log(err.message);
    res.status(500).send({
      message: "Add bookmark failed",
    });
  });
}

exports.removeBookmark = (req, res) => {
  condition = {user_id:req.body.user_id, book_id:req.body.book_id};
  User_Book.findOne(condition).then(bookData => {
    const indx = bookData.bookmarks.findIndex(v => v._id.toString()===req.body.bookmark_id);
    console.log(indx);
    if (indx != -1){
      // bookmark with matching name found
      bookData.bookmarks.splice(indx, 1);
      User_Book.findByIdAndUpdate(bookData._id, {$set: {bookmarks:bookData.bookmarks}}).catch((err) => {
        console.log(err.message);
      });
      res.status(200).send({
        bookmarks: bookData.bookmarks
      });
      return;
    }
    res.status(404).send({
      message: "Bookmark not found",
    });
  })
  .catch((err) => {
    console.log(err.message);
    res.status(500).send({
      message: "Remove bookmark failed",
    });
  });
}
