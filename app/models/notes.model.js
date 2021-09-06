module.exports = mongoose => {
    const Note = mongoose.model(
      "Note",
      mongoose.Schema(
        {
          title: String,
          imageURL: String,
          ingredientList: [[String]],
          instructionList: [String],
          ingredient: String,
          instruction: String,
          amount: String
        },
        { timestamps: true }
      )
    );
  
    return Note;
  };