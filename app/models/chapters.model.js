module.exports = mongoose => {
    const Chapter = mongoose.model(
      "Chapter",
      mongoose.Schema(
        {
          number: String,
          bookID: Number,
          page: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Page'
          }
        },
        { timestamps: true }
      )
    );
  
    return Chapter;
  };