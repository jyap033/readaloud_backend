const fs = require("fs");
const PDFParser = require("pdf2json");

const path = require("path");

const mongoose = require("mongoose");
const db = require("../models");
const Page = db.pages;
const Book = db.books;
const Chapter = db.chapters;

exports.upload = async (req, res, next) => {
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

  //TODO: add it into database and assign userID
 
  var pageArr = [];
  var chapterArr = [];
  var page_number = 0;
  var pageIDArr = [];


  textArr.forEach(function (entry) {
    console.log(entry);
    console.log(
      "\n\n================PageBreak" + page_number + "==================="
    );
    const pageID = new mongoose.Types.ObjectId();
    pageIDArr.push(pageID);
    const page = new Page({
      _id: pageID,
      number: page_number,
      chapterNumber: 1,
      // chapterBookID: Number,
      body: entry,
    });
    page_number++;
    page.save();

  });

  const bookID = new mongoose.Types.ObjectId();
  const chapterID = new mongoose.Types.ObjectId();


  const chapter = new Chapter({
    _id: chapterID,
    number: 1,
    // bookID: bookID,
    pages: pageIDArr,
  });




  var audiobook = new Book({
      _id: bookID,
    // bookID: bookID,
    userID: "Test",
    bookTitle: fileName,
    author: "Test",
    chapters: [chapterID],
  });

  chapter.save()
  audiobook
    .save(
        audiobook)
    .then((data) => {
      //   res.status(201).json({ title: data, text: textArr });
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Audiobook.",
      });
    });

  //
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
