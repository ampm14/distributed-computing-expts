import socket, json, struct

def recv_exact(sock, n: int) -> bytes:
    data = b""
    while len(data) < n:
        packet = sock.recv(n - len(data))
        if not packet:
            raise ConnectionError("Connection closed")
        data += packet
    return data

def rpc_call(s, function, args):
    request = json.dumps({"function": function, "args": args}).encode()
    s.sendall(struct.pack("Q", len(request)))
    s.sendall(request)

    resp_size_data = recv_exact(s, 8)
    (resp_size,) = struct.unpack("Q", resp_size_data)
    resp_data = recv_exact(s, resp_size).decode()
    return json.loads(resp_data)

def print_book(row):
    try:
        (bid, title, authors, avg, isbn, isbn13, lang, pages, ratings, reviews, pub_date, publisher) = row
        print(f"[{bid}] {title} by {authors} | Rating: {avg} | Pages: {pages} | Publisher: {publisher} ({pub_date})")
    except Exception:
        print(row)

def main():
    host = input("Enter server IP: ")
    port = int(input("Enter server port: "))

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((host, port))
        while True:
            print("\n1. Get book by ID")
            print("2. Search books by keyword (title/author)")
            print("3. List first 20 books")
            print("4. Exit")
            op = int(input("> "))

            if op == 1:
                book_id = int(input("Enter book ID: "))
                result = rpc_call(s, "get_book", [book_id])
                if "error" in result:
                    print("Error:", result["error"])
                else:
                    print_book(result["result"])

            elif op == 2:
                keyword = input("Enter keyword: ")
                result = rpc_call(s, "search_books", [keyword])
                books = result.get("result", [])
                if not books:
                    print("No books found.")
                else:
                    for row in books:
                        print_book(row)

            elif op == 3:
                result = rpc_call(s, "list_books", [])
                books = result.get("result", [])
                if not books:
                    print("No books in database.")
                else:
                    for row in books:
                        print_book(row)

            else:
                print("Exiting.")
                break

if __name__ == "__main__":
    main()
