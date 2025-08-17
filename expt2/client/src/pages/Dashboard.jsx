"use client"

import { useState } from "react"
import Sidebar from "../components/Sidebar"
import BookList from "../components/BookList"
import BookForm from "../components/BookForm"

export default function Dashboard() {
  const [activeView, setActiveView] = useState("books")
  const [showBookForm, setShowBookForm] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleAddBook = () => {
    setEditingBook(null)
    setShowBookForm(true)
  }

  const handleEditBook = (book) => {
    setEditingBook(book)
    setShowBookForm(true)
  }

  const handleCloseForm = () => {
    setShowBookForm(false)
    setEditingBook(null)
  }

  const handleBookSaved = () => {
    setRefreshTrigger((prev) => prev + 1)
    handleCloseForm()
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <main className="flex-1 overflow-hidden">
        {activeView === "books" && (
          <BookList onAddBook={handleAddBook} onEditBook={handleEditBook} refreshTrigger={refreshTrigger} />
        )}
      </main>

      {showBookForm && <BookForm book={editingBook} onClose={handleCloseForm} onSave={handleBookSaved} />}
    </div>
  )
}
