import express from "express"
import Book from "../models/Book.js"
import { authenticateToken } from "../middleware/auth.js"

const router = express.Router()

// Apply authentication to all routes
router.use(authenticateToken)

// Get all books with pagination, search, and filters
router.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const search = req.query.search || ""
    const genre = req.query.genre || ""
    const availability = req.query.availability || ""

    // Build query
    const query = {}
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { publisher: { $regex: search, $options: "i" } },
      ]
    }
    if (genre) query.genre = genre
    if (availability) query.availability = availability

    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Book.countDocuments(query)

    res.json({
      books,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get books error:", error)
    res.status(500).json({ error: "Failed to fetch books" })
  }
})

// Get single book
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (!book) {
      return res.status(404).json({ error: "Book not found" })
    }
    res.json(book)
  } catch (error) {
    console.error("Get book error:", error)
    res.status(500).json({ error: "Failed to fetch book" })
  }
})

// Create new book
router.post("/", async (req, res) => {
  try {
    const book = new Book(req.body)
    await book.save()
    res.status(201).json(book)
  } catch (error) {
    console.error("Create book error:", error)
    if (error.code === 11000) {
      res.status(400).json({ error: "ISBN already exists" })
    } else {
      res.status(400).json({ error: error.message })
    }
  }
})

// Update book
router.put("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!book) {
      return res.status(404).json({ error: "Book not found" })
    }
    res.json(book)
  } catch (error) {
    console.error("Update book error:", error)
    res.status(400).json({ error: error.message })
  }
})

// Delete book
router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id)
    if (!book) {
      return res.status(404).json({ error: "Book not found" })
    }
    res.json({ message: "Book deleted successfully" })
  } catch (error) {
    console.error("Delete book error:", error)
    res.status(500).json({ error: "Failed to delete book" })
  }
})

export default router
