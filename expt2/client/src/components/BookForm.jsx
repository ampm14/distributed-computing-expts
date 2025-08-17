"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { X, Save, Star } from "lucide-react"

export default function BookForm({ book, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    genre: "Fiction",
    isbn: "",
    issueDate: "",
    rating: 5,
    format: "Paperback",
    pages: "",
    language: "English",
    availability: "Available",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
  const formats = ["Paperback", "Hardcover", "Ebook"]
  const availabilityOptions = ["Available", "Checked Out", "Reserved"]

  useEffect(() => {
    if (book) {
      setFormData({
        ...book,
        issueDate: new Date(book.issueDate).toISOString().split("T")[0],
      })
    }
  }, [book])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (book) {
        await axios.put(`/books/${book._id}`, formData)
      } else {
        await axios.post("/books", formData)
      }
      onSave()
    } catch (error) {
      setError(error.response?.data?.error || "Failed to save book")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" || name === "pages" ? Number(value) : value,
    }))
  }

  const renderStarRating = () => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
            className={`star w-6 h-6 ${star <= formData.rating ? "filled" : ""}`}
          >
            <Star fill={star <= formData.rating ? "currentColor" : "none"} />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="modal-content card-gradient rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">{book ? "Edit Book" : "Add New Book"}</h2>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-all icon-hover"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter book title"
                required
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Author *</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="form-input w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter author name"
                required
              />
            </div>

            {/* Publisher */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Publisher *</label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                className="form-input w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter publisher name"
                required
              />
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Genre *</label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* ISBN */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">ISBN *</label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className="form-input w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter ISBN"
                required
              />
            </div>

            {/* Issue Date */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Issue Date *</label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                className="form-input w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Rating *</label>
              <div className="flex items-center gap-4">
                {renderStarRating()}
                <span className="text-sm text-muted-foreground">({formData.rating}/5)</span>
              </div>
            </div>

            {/* Format */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Format *</label>
              <select
                name="format"
                value={formData.format}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                {formats.map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </div>

            {/* Pages */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Pages *</label>
              <input
                type="number"
                name="pages"
                value={formData.pages}
                onChange={handleChange}
                className="form-input w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Number of pages"
                min="1"
                required
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Language *</label>
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="form-input w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter language"
                required
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Availability *</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                {availabilityOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="form-input w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Enter book description (optional)"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="loading-spinner w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {book ? "Update Book" : "Add Book"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
