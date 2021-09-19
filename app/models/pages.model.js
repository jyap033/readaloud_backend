module.exports = mongoose => {
    const Page = mongoose.model(
      "Page",
      mongoose.Schema(
        {
          number: Number,
          chapterNumber: Number,
          body: String,

        },
        { timestamps: true }
      )
    );
  
    return Page;
  };