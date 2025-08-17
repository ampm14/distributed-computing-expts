"use client"

import { useAuth } from "../contexts/AuthContext"
import { BookOpen, Library, LogOut } from "lucide-react"

export default function Sidebar({ activeView, setActiveView }) {
  const { logout, admin } = useAuth()

  const menuItems = [{ id: "books", label: "Books", icon: Library }]

  return (
    <div className="w-64 card-gradient border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="logo-container flex items-center gap-3">
          <BookOpen className="logo w-8 h-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">Library Admin</h1>
            <p className="text-sm text-muted-foreground">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  className={`nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeView === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <Icon className="w-5 h-5 icon-hover" />
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-medium">
              {admin?.username?.charAt(0).toUpperCase() || "A"}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{admin?.username || "Admin"}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
        >
          <LogOut className="w-5 h-5 icon-hover" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
