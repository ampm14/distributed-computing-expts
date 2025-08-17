
## Setup Instructions

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Seed Database
\`\`\`bash
npm run seed
\`\`\`

### 4. Start Server
\`\`\`bash
# Production
npm start

# Development (with auto-restart)
npm run dev
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token

### Books (Protected Routes)
- `GET /api/books` - Get all books (with pagination, search, filters)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Health Check
- `GET /api/health` - Server status

## Default Admin Credentials
- Username: `admin`
- Password: `admin123`

## Cross-Machine Setup
The server is configured to accept connections from any IP address. Make sure to:
1. Update MongoDB URI with your laptop's IP address
2. Configure firewall to allow connections on port 5000
3. Update the client's API_BASE_URL to point to this server's IP
