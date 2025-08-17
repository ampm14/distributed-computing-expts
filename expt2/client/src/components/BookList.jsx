"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Plus, Search, Edit, Trash2, Star, BookOpen, Calendar, User } from "lucide-react"

export default function BookList({ onAddBook, onEditBook, refreshTrigger }) {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [genre, setGenre] = useState("")
  const [availability, setAvailability] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const genres = [
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
  ]
  const availabilityOptions = ["Available", "Checked Out", "Reserved"]

  useEffect(() => {
    fetchBooks()
  }, [currentPage, search, genre, availability, refreshTrigger])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(search && { search }),
        ...(genre && { genre }),
        ...(availability && { availability }),
      })

      const response = await axios.get(`/books?${params}`)
      setBooks(response.data.books)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error("Failed to fetch books:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (bookId) => {
    if (!confirm("Are you sure you want to delete this book?")) return

    try {
      await axios.delete(`/books/${bookId}`)
      fetchBooks()
    } catch (error) {
      console.error("Failed to delete book:", error)
    }
  }

  const renderRating = (rating) => {
    return (
      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 star cursor-pointer hover:scale-125 hover:rotate-12 transition-all duration-300" />
        <span className="text-foreground font-medium">{rating.toFixed(1)}</span>
      </div>
    )
  }

  const getStatusBadge = (status) => {
    const colors = {
      Available: "bg-green-500/20 text-green-400 border-green-500/30",
      "Checked Out": "bg-red-500/20 text-red-400 border-red-500/30",
      Reserved: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    }

    return (
      <span className={`status-badge px-2 py-1 rounded-full text-xs font-medium border ${colors[status]}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Library Books</h1>
            <p className="text-muted-foreground">Manage your book collection</p>
          </div>
          <button
            onClick={onAddBook}
            className="floating-action btn-primary flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-primary-foreground"
          >
            <Plus className="w-5 h-5" />
            Add Book
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search books, authors, publishers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Status</option>
            {availabilityOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="loading-spinner w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No books found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                className="card-gradient rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-border/50 backdrop-blur-sm"
              >
                {/* Book Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-lg mb-2 leading-tight line-clamp-2">{book.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(book.issueDate).getFullYear()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => onEditBook(book)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 icon-hover group"
                      title="Edit Book"
                    >
                      <Edit className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200 icon-hover group"
                      title="Delete Book"
                    >
                      <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Author & Publisher */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-foreground font-medium mb-1">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-sm">{book.author}</span>
                  </div>
                  <p className="text-sm text-slate-300 pl-6">{book.publisher}</p>
                </div>

                {/* Genre & Format */}
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-primary/20 to-primary/10 text-blue-300 rounded-full text-sm font-medium border border-primary/20 mb-2">
                    {book.genre}
                  </span>
                  <p className="text-sm text-slate-300">
                    <span className="font-medium text-slate-200">{book.format}</span> • {book.pages}p
                  </p>
                </div>

                {/* Rating & Status */}
                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                  <div className="flex items-center gap-3">{renderRating(book.rating)}</div>
                  <div>{getStatusBadge(book.availability)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-6 py-3 bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-secondary/80 hover:to-secondary transition-all duration-200 font-medium shadow-lg"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-12 h-12 rounded-xl font-medium transition-all duration-200 ${
                      currentPage === pageNum
                        ? "bg-primary text-primary-foreground shadow-lg scale-110"
                        : "bg-secondary/50 text-secondary-foreground hover:bg-secondary hover:scale-105"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-6 py-3 bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-secondary/80 hover:to-secondary transition-all duration-200 font-medium shadow-lg"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
