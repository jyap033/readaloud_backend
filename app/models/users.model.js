module.exports = mongoose => {
    const User = mongoose.model(
      "User",
      mongoose.Schema(
        {
          userID: String,
          name: String,
          email: String,
        },
        { timestamps: true }
      )
    );
  
    return User;
  };