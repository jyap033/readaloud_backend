const fs = require("fs");
const PDFParser = require("pdf2json");

const path = require("path");

const mongoose = require("mongoose");
const db = require("../models");
const Page = db.pages;
const BookInfo = db.books_info;
const BookContent = db.books_content;
const UserBooks = db.user_books;

exports.upload = async (req, res) => {
  var userID = req.body.id;
  var fileName = "";

  try {
    if (req.file) {
      fileName = req.file.originalname ?? "test";
      var filepath = path.join(path.join(__dirname, "../../"), req.file.path);
      console.log(filepath);
      var stream = fs.readFileSync(filepath);
      var extracted_text = await getPDFText(stream);
      let re = /\r\n----------------Page.*Break----------------\r\n/g;
      var textArr = extracted_text.split(re);
      fs.unlink(filepath, () => {});
    } else {
      console.log("req.file == null");
      res.status(404).json({ errors });
      // stop further execution in this callback
    }
  } catch (err) {
    res.status(503).send({
      message: err.message || "Some error occurred while creating the Note.",
    });
  }

  var pageArr = [];
  var page_number = 0;

  textArr.forEach(function (entry) {
    // console.log(entry);
    // console.log(
    //   "\n\n================PageBreak" + page_number + "==================="
    // );
    // const pageID = new mongoose.Types.ObjectId();
    // pageIDArr.push(pageID);
    const page = new Page({
      number: page_number,
      chapterNumber: 1,
      // chapterBookID: Number,
      body: entry,
    });
    page_number++;
    pageArr.push(page);
    // page.save();
  });
  console.log("Book Created.");

  const bookID = new mongoose.Types.ObjectId();

  var bookInfo = new BookInfo({
    _id: bookID,
    // bookID: bookID,
    ownerUserID: userID,
    bookTitle: fileName,
    author: "Test",
  });

  var bookContent = new BookContent({
    bookID: bookID,
    page: pageArr,
  });

  var userBooks = new UserBooks({
    user_id: userID,
    book_id: bookID,
    currentPage: 1,
  });

  userBooks.save(userBooks).catch((err) => {
    res.status(500).send({
      message: err.message || "Some error occurred while creating userBooks.",
    });
  });

  bookContent.save(bookContent).catch((err) => {
    res.status(500).send({
      message: err.message || "Some error occurred while creating bookContent.",
    });
  });

  bookInfo
    .save(bookInfo)
    .then((data) => {
      //   res.status(201).json({ title: data, text: textArr });
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating bookInfo.",
      });
    });
};

function getPDFText(data) {
  try {
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser(null, 1);
      pdfParser.on("pdfParser_dataError", reject);
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        resolve(pdfParser.getRawTextContent());
      });
      pdfParser.parseBuffer(data);
    });
  } catch (e) {
    console.log(e);
  }
}
