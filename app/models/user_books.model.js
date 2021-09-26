module.exports = mongoose => {
    const UserBook = mongoose.model(
      "UserBook",
      mongoose.Schema(
        {
          user_id: Number,
          book_id: Number,
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