import sqlite3, csv, os

db_path = os.path.join(os.path.dirname(__file__), "books.db")
os.makedirs(os.path.dirname(db_path), exist_ok=True)

conn = sqlite3.connect(db_path)
cur = conn.cursor()

cur.execute("DROP TABLE IF EXISTS books")
cur.execute("""
CREATE TABLE books (
    bookID INTEGER PRIMARY KEY,
    title TEXT,
    authors TEXT,
    average_rating REAL,
    isbn TEXT,
    isbn13 TEXT,
    language_code TEXT,
    num_pages INTEGER,
    ratings_count INTEGER,
    text_reviews_count INTEGER,
    publication_date TEXT,
    publisher TEXT
)
""")

csv_path = os.path.join(os.path.dirname(__file__), "books.csv")

def safe_int(val):
    try:
        return int(val)
    except:
        return None

def safe_float(val):
    try:
        return float(val)
    except:
        return None

with open(csv_path, newline='', encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        try:
            cur.execute("""
                INSERT INTO books (bookID, title, authors, average_rating, isbn, isbn13, language_code,
                                   num_pages, ratings_count, text_reviews_count, publication_date, publisher)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                safe_int(row.get("bookID")),
                row.get("title"),
                row.get("authors"),
                safe_float(row.get("average_rating")),
                row.get("isbn"),
                row.get("isbn13"),
                row.get("language_code"),
                safe_int(row.get("  num_pages") or row.get("num_pages")),  # handle weird header
                safe_int(row.get("ratings_count")),
                safe_int(row.get("text_reviews_count")),
                row.get("publication_date"),
                row.get("publisher")
            ))
        except Exception as e:
            print(f"[!] Skipping bad row: {row}")
            print("    Error:", e)

conn.commit()
conn.close()
print(f"[✓] Database created at {db_path}")
