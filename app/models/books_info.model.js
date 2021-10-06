module.exports = (mongoose) => {
  const BookInfo = mongoose.model(
    "BookInfo",
    mongoose.Schema(
      {
        ownerUserID: String,
        pdfName: String,
        author: String,
        // page: [Page]
      },
      { timestamps: true }
    )
  );

  return BookInfo;
};
// };module.exports = mongoose => {
//   const Book = mongoose.model(
//     "Book",
//     mongoose.Schema(
//       {
//         userID: String,
//         bookTitle: String,
//         author: String,
//         chapters: [{
//           type: mongoose.Schema.Types.ObjectId,
//           required: true,
//           ref: 'Chapter'
//         }]
//       },
//       { timestamps: true }
//     )
//   );

//   return Book;
// };
