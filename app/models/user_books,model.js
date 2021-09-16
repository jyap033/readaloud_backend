module.exports = mongoose => {
    const UserBook = mongoose.model(
      "UserBook",
      mongoose.Schema(
        {
          userID: Number,
          bookID: Number,
          currentPage: Number,
        },
        { timestamps: true }
      )
    );
  
    return UserBook;
  };