import mongoose from "mongoose"

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    publisher: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      enum: [
        "Fiction",
        "Non-Fiction",
        "Mystery",
        "Romance",
        "Sci-Fi",
        "Fantasy",
        "Biography",
        "History",
        "Science",
        "Technology",
        "Self-Help",
        "Business",
      ],
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    format: {
      type: String,
      required: true,
      enum: ["Paperback", "Hardcover", "Ebook"],
    },
    pages: {
      type: Number,
      required: true,
      min: 1,
    },
    language: {
      type: String,
      required: true,
      default: "English",
    },
    availability: {
      type: String,
      required: true,
      enum: ["Available", "Checked Out", "Reserved"],
      default: "Available",
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model("Book", bookSchema)
