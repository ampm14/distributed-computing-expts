import socket
import json
import struct
import sys
import mysql.connector

def recv_exact(sock, n: int) -> bytes:
    """Receive exactly n bytes from the socket."""
    data = b""
    while len(data) < n:
        packet = sock.recv(n - len(data))
        if not packet:
            raise ConnectionError("Connection closed")
        data += packet
    return data

def query_db(query, params=()):
    """Run a query against the MySQL database and return results."""
    conn = mysql.connector.connect(
        host="127.0.0.1",      # <-- Change this to PC1's IP when DB is remote
        user="bookuser",       # must match the user you created in MySQL
        password="password123",# must match the password you set
        database="bookdb"      # name of the DB created in MySQL
    )
    cur = conn.cursor()
    cur.execute(query, params)
    rows = cur.fetchall()
    conn.close()
    return rows

def handle_request(request: str):
    """Handle incoming client requests and query DB accordingly."""
    data = json.loads(request)
    func_name = data["function"]
    args = data["args"]

    if func_name == "get_book":
        book_id = args[0]
        rows = query_db("SELECT * FROM books WHERE bookID=%s", (book_id,))
        if rows:
            return {"result": rows[0]}
        else:
            return {"error": f"Book with ID {book_id} not found"}

    elif func_name == "search_books":
        keyword = f"%{args[0]}%"
        rows = query_db("SELECT * FROM books WHERE title LIKE %s OR authors LIKE %s", (keyword, keyword))
        return {"result": rows}

    elif func_name == "list_books":
        rows = query_db("SELECT * FROM books LIMIT 20")
        return {"result": rows}

    else:
        return {"error": f"Unknown function {func_name}"}

def main():
    if len(sys.argv) != 2:
        print("Usage: python server_books.py <port>")
        sys.exit(1)

    host = "0.0.0.0"  # listen on all interfaces (LAN + localhost)
    port = int(sys.argv[1])

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        s.bind((host, port))
        s.listen()
        print(f"[Server] Listening on {host}:{port}...")

        while True:
            conn, addr = s.accept()
            print(f"[Server] Client connected from {addr}")
            with conn:
                while True:
                    try:
                        size_data = recv_exact(conn, 8)
                        if not size_data:
                            break
                        (size,) = struct.unpack("Q", size_data)
                        request = recv_exact(conn, size).decode()

                        response = handle_request(request)
                        response_bytes = json.dumps(response).encode()

                        conn.sendall(struct.pack("Q", len(response_bytes)))
                        conn.sendall(response_bytes)

                    except ConnectionError:
                        print(f"[Server] Client {addr} disconnected")
                        break
                    except Exception as e:
                        error = json.dumps({"error": str(e)}).encode()
                        conn.sendall(struct.pack("Q", len(error)))
                        conn.sendall(error)
                        break

if __name__ == "__main__":
    main()
