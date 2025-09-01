import socket, json, struct, sys, multiprocessing
import mysql.connector

# ---------- Helpers ----------
def recv_exact(sock, n: int) -> bytes:
    data = b""
    while len(data) < n:
        packet = sock.recv(n - len(data))
        if not packet:
            raise ConnectionError("Connection closed")
        data += packet
    return data

def query_db(query, params=()):
    conn = mysql.connector.connect(
        host="127.0.0.1",   # change to PC1 IP if DB is remote
        user="bookuser",
        password="password123",
        database="bookdb"
    )
    cur = conn.cursor()
    cur.execute(query, params)
    rows = cur.fetchall()
    conn.close()
    return rows

def handle_request(request: str):
    data = json.loads(request)
    func_name = data["function"]
    args = data["args"]

    if func_name == "get_book":
        book_id = args[0]
        rows = query_db("SELECT * FROM books WHERE bookID=%s", (book_id,))
        return {"result": rows[0]} if rows else {"error": f"Book {book_id} not found"}

    elif func_name == "search_books":
        keyword = f"%{args[0]}%"
        rows = query_db("SELECT * FROM books WHERE title LIKE %s OR authors LIKE %s", (keyword, keyword))
        return {"result": rows}

    elif func_name == "list_books":
        rows = query_db("SELECT * FROM books LIMIT 20")
        return {"result": rows}

    else:
        return {"error": f"Unknown function {func_name}"}

def client_process(conn, addr):
    print(f"[Server] Client connected: {addr}")
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
            except Exception as e:
                error = json.dumps({"error": str(e)}).encode()
                try:
                    conn.sendall(struct.pack("Q", len(error)))
                    conn.sendall(error)
                except:
                    pass
                break
    print(f"[Server] Client disconnected: {addr}")

def main():
    if len(sys.argv) != 2:
        print("Usage: python server_books_multiprocess.py <port>")
        sys.exit(1)

    host = "0.0.0.0"
    port = int(sys.argv[1])

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        s.bind((host, port))
        s.listen()
        print(f"[Multiprocessing Server] Listening on {host}:{port}...")

        while True:
            conn, addr = s.accept()
            # Start new process per client
            process = multiprocessing.Process(target=client_process, args=(conn, addr))
            process.daemon = True
            process.start()

if __name__ == "__main__":
    main()
