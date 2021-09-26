module.exports = mongoose => {
    const UserBook = mongoose.model(
      "UserBook",
      mongoose.Schema(
        {
          user_id: String,
          book_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Book'
          },
          currentPage: Number,
          bookmarks: [{
            page: Number,
            name: String
          }]
        },
        { timestamps: true }
      )
    );
  
    return UserBook;
  };