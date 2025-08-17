import mongoose from "mongoose"
import dotenv from "dotenv"
import Admin from "../models/Admin.js"
import Book from "../models/Book.js"

dotenv.config()

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("✅ Connected to MongoDB")

    // Clear existing data
    await Admin.deleteMany({})
    await Book.deleteMany({})
    console.log("🧹 Cleared existing data")

    // Create admin user
    const admin = new Admin({
      username: process.env.ADMIN_USERNAME || "admin",
      password: process.env.ADMIN_PASSWORD || "admin123",
    })
    await admin.save()
    console.log("👤 Created admin user")

    // Sample books data
    const books = [
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        publisher: "Scribner",
        genre: "Fiction",
        isbn: "978-0-7432-7356-5",
        issueDate: new Date("2004-09-30"),
        rating: 4.2,
        format: "Paperback",
        pages: 180,
        language: "English",
        availability: "Available",
        description:
          "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        publisher: "J.B. Lippincott & Co.",
        genre: "Fiction",
        isbn: "978-0-06-112008-4",
        issueDate: new Date("1960-07-11"),
        rating: 4.8,
        format: "Hardcover",
        pages: 376,
        language: "English",
        availability: "Available",
        description: "A gripping tale of racial injustice and childhood innocence in the American South.",
      },
      {
        title: "1984",
        author: "George Orwell",
        publisher: "Secker & Warburg",
        genre: "Sci-Fi",
        isbn: "978-0-452-28423-4",
        issueDate: new Date("1949-06-08"),
        rating: 4.6,
        format: "Paperback",
        pages: 328,
        language: "English",
        availability: "Checked Out",
        description: "A dystopian social science fiction novel about totalitarian control and surveillance.",
      },
      {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        publisher: "T. Egerton",
        genre: "Romance",
        isbn: "978-0-14-143951-8",
        issueDate: new Date("1813-01-28"),
        rating: 4.4,
        format: "Ebook",
        pages: 432,
        language: "English",
        availability: "Available",
        description: "A romantic novel that critiques the British landed gentry at the end of the 18th century.",
      },
      {
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        publisher: "Little, Brown and Company",
        genre: "Fiction",
        isbn: "978-0-316-76948-0",
        issueDate: new Date("1951-07-16"),
        rating: 3.8,
        format: "Paperback",
        pages: 277,
        language: "English",
        availability: "Reserved",
        description: "A controversial novel about teenage rebellion and alienation in post-war America.",
      },
      {
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        publisher: "George Allen & Unwin",
        genre: "Fantasy",
        isbn: "978-0-544-00341-5",
        issueDate: new Date("1954-07-29"),
        rating: 4.9,
        format: "Hardcover",
        pages: 1216,
        language: "English",
        availability: "Available",
        description:
          "An epic high fantasy novel about the quest to destroy the One Ring and defeat the Dark Lord Sauron.",
      },
      {
        title: "The Da Vinci Code",
        author: "Dan Brown",
        publisher: "Doubleday",
        genre: "Mystery",
        isbn: "978-0-385-50420-1",
        issueDate: new Date("2003-03-18"),
        rating: 4.1,
        format: "Paperback",
        pages: 689,
        language: "English",
        availability: "Available",
        description:
          "A mystery thriller that follows symbologist Robert Langdon as he investigates a murder in the Louvre.",
      },
      {
        title: "Steve Jobs",
        author: "Walter Isaacson",
        publisher: "Simon & Schuster",
        genre: "Biography",
        isbn: "978-1-4516-4853-9",
        issueDate: new Date("2011-10-24"),
        rating: 4.5,
        format: "Hardcover",
        pages: 656,
        language: "English",
        availability: "Available",
        description: "The authorized biography of Apple co-founder Steve Jobs, based on extensive interviews.",
      },
      {
        title: "Sapiens",
        author: "Yuval Noah Harari",
        publisher: "Harvill Secker",
        genre: "History",
        isbn: "978-0-06-231609-7",
        issueDate: new Date("2014-09-04"),
        rating: 4.7,
        format: "Ebook",
        pages: 443,
        language: "English",
        availability: "Available",
        description: "A brief history of humankind, exploring how Homo sapiens came to dominate the world.",
      },
      {
        title: "The Lean Startup",
        author: "Eric Ries",
        publisher: "Crown Business",
        genre: "Business",
        isbn: "978-0-307-88789-4",
        issueDate: new Date("2011-09-13"),
        rating: 4.3,
        format: "Paperback",
        pages: 336,
        language: "English",
        availability: "Checked Out",
        description:
          "A methodology for developing businesses and products through validated learning and iterative design.",
      },
    ]

    // Insert books
    await Book.insertMany(books)
    console.log("📚 Created 10 sample books")

    console.log("\n🎉 Database seeded successfully!")
    console.log(`👤 Admin login: ${admin.username} / ${process.env.ADMIN_PASSWORD || "admin123"}`)

    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error("❌ Seeding error:", error)
    process.exit(1)
  }
}

seedData()
