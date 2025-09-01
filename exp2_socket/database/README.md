

---

# Book Database

* **Database Tier (PC1)** → MySQL server that stores books (seeded from `books.csv`).
* **Application Tier (PC2)** → Python server (`server_books.py`) that connects to the database and handles client requests.
* **Client Tier (PC3)** → Python client (`client_books.py`) that connects to the server and lets the user search/query books.



---

## Setup Instructions

### 1. Database Tier (PC1)

**Install MySQL**

```bash
sudo apt update
sudo apt install mysql-server -y
```

**Log into MySQL as root**

```bash
sudo mysql
```

**Create DB and user**

```sql
CREATE DATABASE bookdb;
CREATE USER 'bookuser'@'%' IDENTIFIED BY 'password123';
CREATE USER 'bookuser'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON bookdb.* TO 'bookuser'@'%';
GRANT ALL PRIVILEGES ON bookdb.* TO 'bookuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Enable remote connections**
Edit MySQL config:

```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

Change:

```
bind-address = 0.0.0.0
```

Save & exit (`Ctrl+O`, `Enter`, `Ctrl+X`).

**Restart MySQL**

```bash
sudo systemctl restart mysql
```

**Seed the CSV into the DB**

```bash
cd exp02/database
python3 -m venv venv
source venv/bin/activate
pip install mysql-connector-python
python3 db_setup_mysql.py
```

**Verify**

```bash
mysql -u bookuser -p bookdb -e "SELECT COUNT(*) FROM books;"
```

---

### 2. Server Tier (PC2)

Copy the `server/` folder to PC2.

**Install dependencies**

```bash
cd exp02/server
python3 -m venv venv
source venv/bin/activate
pip install mysql-connector-python
```

**Edit `server_books.py` → in `query_db()` set PC1’s IP**

```python
conn = mysql.connector.connect(
    host="192.168.1.10",  # replace with PC1’s IP
    user="bookuser",
    password="password123",
    database="bookdb"
)
```

**Run the server**

```bash
python3 server_books.py 8080
```

Expected output:

```
[Server] Listening on 0.0.0.0:8080...
```

**Firewall**
Ensure PC2 allows incoming traffic on port `8080`.

---

### 3. Client Tier (PC3)

Copy the `client/` folder to PC3.

**Install dependencies**

```bash
cd exp02/client
python3 -m venv venv
source venv/bin/activate
```

(No extra packages needed, uses Python standard library only.)

**Run client**

```bash
python3 client_books.py
```

When prompted:

```
Server IP: <PC2_IP>
Server port: 8080
```

---

## Usage

Menu options in the client:

```
1. Get book by ID
2. Search books by keyword (title/author)
3. List first 20 books
4. Exit
```

Examples:

* Option 1 → `1` → shows Harry Potter and the Half-Blood Prince.
* Option 2 → `Potter` → finds all books with “Potter” in title/author.
* Option 3 → dumps first 20 rows to confirm DB connection.

---

## Network Checklist

* **PC1 (DB)** → open port `3306` (MySQL), restrict to PC2’s IP if possible:

  ```bash
  sudo ufw allow from <PC2_IP> to any port 3306
  ```

* **PC2 (Server)** → open port `8080` for PC3:

  ```bash
  sudo ufw allow from <PC3_IP> to any port 8080
  ```

* **PC3 (Client)** → no firewall config needed, just must reach PC2.

---

## Deployment Summary

* **PC1**: Runs MySQL with `bookdb` seeded from `books.csv`.
* **PC2**: Runs `server_books.py`, connects to MySQL on PC1.
* **PC3**: Runs `client_books.py`, connects to server on PC2.

