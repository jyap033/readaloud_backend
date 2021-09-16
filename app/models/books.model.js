module.exports = mongoose => {
    const Book = mongoose.model(
      "Book",
      mongoose.Schema(
        {
          userID: String,
          bookTitle: String,
          author: String,
          date_added: { type: Date, default: Date.now },
          chapters: [{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Chapter'
          }]
        },
        { timestamps: true }
      )
    );
  
    return Book;
  };