import streamlit as st
import socket, json, struct, time

# ---------- Networking helpers ----------
def recv_exact(sock, n: int) -> bytes:
    """Receive exactly n bytes from the socket"""
    data = b""
    while len(data) < n:
        packet = sock.recv(n - len(data))
        if not packet:
            raise ConnectionError("Connection closed")
        data += packet
    return data

def rpc_call(server_ip, port, function, args):
    """Send RPC request to server and get response"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((server_ip, port))
        request = json.dumps({"function": function, "args": args}).encode()
        s.sendall(struct.pack("Q", len(request)))
        s.sendall(request)

        resp_size_data = recv_exact(s, 8)
        (resp_size,) = struct.unpack("Q", resp_size_data)
        resp_data = recv_exact(s, resp_size).decode()
        return json.loads(resp_data)

# ---------- Enhanced book card renderer ----------
def show_books(books):
    """Render results as styled cards using Streamlit components"""
    if not books:
        st.warning("No books found. Try adjusting your search criteria.")
        return

    st.success(f"Found {len(books)} book{'s' if len(books) != 1 else ''}!")

    for row in books:
        bid, title, authors, avg, isbn, isbn13, lang, pages, ratings, reviews, pub_date, publisher = row

        # Create a container for each book
        with st.container():
            # Use columns for layout
            col1, col2 = st.columns([3, 1])
            
            with col1:
                st.markdown(f"### {title}")
                st.markdown(f"**Author:** {authors}")
                st.markdown(f"**Publisher:** {publisher} ({pub_date})")
                
            with col2:
                if avg:
                    if avg >= 4.5:
                        st.success(f"⭐ {avg}")
                    elif avg >= 4.0:
                        st.info(f"⭐ {avg}")
                    else:
                        st.warning(f"⭐ {avg}")
                else:
                    st.write("No rating")
            
            # Book details in columns
            col1, col2, col3 = st.columns(3)
            with col1:
                st.metric("Language", lang)
            with col2:
                st.metric("Pages", pages)
            with col3:
                st.metric("Ratings", f"{ratings:,}")
            
            # Additional info
            st.markdown(f"**Reviews:** {reviews:,}")
            st.markdown(f"**Book ID:** {bid} | **ISBN:** {isbn} | **ISBN13:** {isbn13}")
            
            st.divider()

# ---------- Streamlit UI ----------
st.set_page_config(page_title="Book Database Explorer", layout="wide")

# Dark navy blue theme with white and magenta accents
st.markdown(
    """
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        .stApp {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
            font-family: 'Inter', sans-serif;
        }
        
        .main-header {
            text-align: center;
            padding: 50px 30px;
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 25px;
            backdrop-filter: blur(20px);
            margin: 20px 0 40px 0;
            animation: fadeInDown 1s ease-out;
        }
        
        .connection-section {
            background: rgba(15, 23, 42, 0.9);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 20px;
            padding: 30px;
            backdrop-filter: blur(20px);
            margin: 25px 0;
        }
        
        .action-section {
            background: rgba(15, 23, 42, 0.9);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 20px;
            padding: 30px;
            backdrop-filter: blur(20px);
            margin: 25px 0;
        }
        
        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        h1, h2, h3, h4, h5, h6 {
            color: #ffffff !important;
            font-weight: 400 !important;
        }
        
        .main-title {
            font-size: 3.5rem !important;
            font-weight: 700 !important;
            background: linear-gradient(135deg, #ffffff 0%, #c74da6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 15px !important;
        }
        
        .subtitle {
            font-size: 1.2rem !important;
            color: #c74da6 !important;
            font-weight: 400 !important;
            margin-top: 0 !important;
        }
        
        label, .stRadio > div, .stSelectbox > div, .stTextInput > div > div {
            color: #ffffff !important;
            font-weight: 500 !important;
        }
        
        .stButton > button {
            background: linear-gradient(135deg, #1e40af 0%, #c74da6 100%) !important;
            color: white !important;
            border: none !important;
            border-radius: 15px !important;
            padding: 15px 30px !important;
            font-weight: 600 !important;
            font-size: 16px !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 6px 20px rgba(199, 77, 166, 0.3) !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
        }
        
        .stButton > button:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 25px rgba(199, 77, 166, 0.4) !important;
            background: linear-gradient(135deg, #2563eb 0%, #db2777 100%) !important;
        }
        
        .stTextInput > div > div > input,
        .stNumberInput > div > div > input {
            background: rgba(30, 41, 59, 0.8) !important;
            border: 1px solid rgba(255,255,255,0.2) !important;
            border-radius: 12px !important;
            padding: 15px 20px !important;
            font-size: 16px !important;
            color: #ffffff !important;
            backdrop-filter: blur(10px);
        }
        
        .stTextInput > div > div > input:focus,
        .stNumberInput > div > div > input:focus {
            border-color: #c74da6 !important;
            box-shadow: 0 0 0 2px rgba(199, 77, 166, 0.2) !important;
        }
        
        .stRadio > div {
            background: rgba(30, 41, 59, 0.6);
            padding: 25px;
            border-radius: 15px;
            border: 1px solid rgba(255,255,255,0.1);
            backdrop-filter: blur(15px);
        }
        
        .stRadio > div > label {
            color: #ffffff !important;
            font-size: 16px !important;
            font-weight: 500 !important;
            padding: 8px 0 !important;
        }
        
        .stSpinner > div {
            border-top-color: #c74da6 !important;
        }
        
        .stAlert > div {
            background-color: rgba(30, 41, 59, 0.9) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            color: #ffffff !important;
        }
        
        .footer-section {
            text-align: center;
            padding: 40px 20px 20px 20px;
            color: rgba(255,255,255,0.6);
            font-size: 16px;
            margin-top: 50px;
            border-top: 1px solid rgba(255,255,255,0.1);
        }
    </style>
    """,
    unsafe_allow_html=True
)

# Beautiful header
st.markdown(
    """
    <div class="main-header">
        <h1 class="main-title">Book Database Explorer</h1>
        <p class="subtitle">Search and explore your books with elegant design</p>
    </div>
    """,
    unsafe_allow_html=True
)

# Connection inputs in styled container
st.markdown('<div class="connection-section">', unsafe_allow_html=True)
st.markdown("### Server Connection")

col1, col2 = st.columns(2)
with col1:
    server_ip = st.text_input("Server IP", "127.0.0.1", help="Enter the IP address of your book database server")
with col2:
    port = st.number_input("Server Port", 8080, step=1, help="Enter the port number")

# Connection status
st.markdown(f"""
    <div style="margin-top: 15px; padding: 10px 0;">
        <span style="color: #ffffff; font-weight: 500;">
            Ready to connect to <span style="color: #c74da6;">{server_ip}:{port}</span>
        </span>
    </div>
""", unsafe_allow_html=True)

st.markdown('</div>', unsafe_allow_html=True)

# Actions in styled container
st.markdown('<div class="action-section">', unsafe_allow_html=True)
st.markdown("### Choose Your Action")

# Radio menu
action = st.radio(
    "",
    ["Get book by ID", "Search books", "List first 20"],
    label_visibility="collapsed",
    help="Select what you want to do with the book database"
)

# Actions
if action == "Get book by ID":
    st.markdown("#### Find a specific book")
    book_id = st.number_input("Book ID", min_value=1, step=1, help="Enter the unique book identifier")
    if st.button("Fetch Book"):
        with st.spinner("Searching for your book..."):
            try:
                result = rpc_call(server_ip, port, "get_book", [book_id])
                if "error" in result:
                    st.error(f"Error: {result['error']}")
                else:
                    st.success("Book found successfully!")
                    time.sleep(0.3)
                    show_books([result["result"]])
            except Exception as e:
                st.error(f"Connection error: {str(e)}")

elif action == "Search books":
    st.markdown("#### Search through the collection")
    keyword = st.text_input("Search keyword", placeholder="Enter title, author, or any keyword...", help="Search across titles, authors, and other book details")
    if st.button("Search"):
        if keyword.strip():
            with st.spinner(f"Searching for '{keyword}'..."):
                try:
                    result = rpc_call(server_ip, port, "search_books", [keyword])
                    books = result.get("result", [])
                    if books:
                        st.success(f"Found {len(books)} book{'s' if len(books) != 1 else ''}!")
                    time.sleep(0.3)
                    show_books(books)
                except Exception as e:
                    st.error(f"Connection error: {str(e)}")
        else:
            st.warning("Please enter a search keyword")

elif action == "List first 20":
    st.markdown("#### Browse the collection")
    st.info("This will show you the first 20 books in the database")
    if st.button("List Books"):
        with st.spinner("Loading first 20 books..."):
            try:
                result = rpc_call(server_ip, port, "list_books", [])
                books = result.get("result", [])
                if books:
                    st.success(f"Loaded {len(books)} books successfully!")
                time.sleep(0.3)
                show_books(books)
            except Exception as e:
                st.error(f"Connection error: {str(e)}")

st.markdown('</div>', unsafe_allow_html=True)

# Footer
st.markdown(
    """
    <div class="footer-section">
        <p>Book Database Project – 3 Tier Architecture Demo</p>
        <p style="font-size: 14px; color: rgba(199, 77, 166, 0.8); margin-top: 10px;">Built with Streamlit</p>
    </div>
    """,
    unsafe_allow_html=True
)