module.exports = mongoose => {
    const User = mongoose.model(
      "User",
      mongoose.Schema(
        {
          userID: Number,
          Name: String,
          Email: String,
        },
        { timestamps: true }
      )
    );
  
    return User;
  };