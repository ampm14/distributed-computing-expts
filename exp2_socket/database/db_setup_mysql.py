import mysql.connector, csv

conn = mysql.connector.connect(
    host="127.0.0.1",   # on PC1 localhost
    user="bookuser",
    password="password123",
    database="bookdb"
)
cur = conn.cursor()

cur.execute("DROP TABLE IF EXISTS books")
cur.execute("""
CREATE TABLE books (
    bookID INT PRIMARY KEY,
    title TEXT,
    authors TEXT,
    average_rating FLOAT,
    isbn VARCHAR(50),
    isbn13 VARCHAR(50),
    language_code VARCHAR(20),
    num_pages INT,
    ratings_count INT,
    text_reviews_count INT,
    publication_date VARCHAR(50),
    publisher TEXT
)
""")

with open("books.csv", newline='', encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        try:
            cur.execute("""
                INSERT INTO books (bookID, title, authors, average_rating, isbn, isbn13, language_code,
                                   num_pages, ratings_count, text_reviews_count, publication_date, publisher)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                int(row.get("bookID")) if row.get("bookID") else None,
                row.get("title"),
                row.get("authors"),
                float(row.get("average_rating")) if row.get("average_rating") else None,
                row.get("isbn"),
                row.get("isbn13"),
                row.get("language_code"),
                int(row.get("  num_pages") or row.get("num_pages")) if row.get("  num_pages") or row.get("num_pages") else None,
                int(row.get("ratings_count")) if row.get("ratings_count") else None,
                int(row.get("text_reviews_count")) if row.get("text_reviews_count") else None,
                row.get("publication_date"),
                row.get("publisher")
            ))
        except Exception as e:
            print("Skipping bad row:", row)
            print("Error:", e)

conn.commit()
conn.close()
print("[✓] MySQL database seeded successfully")
