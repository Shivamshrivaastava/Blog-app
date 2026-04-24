# 🤖 AI-Powered Blog Platform — MERN Stack + Gemini AI

A full-stack blogging platform powered by **MongoDB, Express.js, React.js, Node.js** and **Groq AI**.

---

## 🚀 Features

### User Module
- Register / Login / Logout with JWT authentication
- Profile management (name, bio, avatar)
- Change password

### Blog Module
- Create, Edit, Delete, Publish blogs
- Save as Draft
- Rich markdown content support
- Categories & Tags
- Cover image support
- Auto read-time calculation

### 🤖 AI Module (Groq AI)
- **Generate Titles** — 5 engaging blog titles from a topic
- **Generate Full Content** — Complete blog drafts with headings
- **Auto Summary / Meta Description** — SEO-friendly 160-char summaries
- **Generate Tags** — 8-10 relevant keyword tags
- **Improve Grammar** — Fix and enhance your writing
- **SEO Headlines** — Power headlines with keyword optimization
- **Intro Ideas** — 3 hook introductions for any title

### Social Features
- Like / Unlike blogs
- Comment on blogs
- Search & filter by category
- Trending blogs section
- View count tracking

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS v4 |
| State | React Context API |
| HTTP | Axios |
| Routing | React Router DOM v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| AI | Groq Api |

---

## 📦 Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Groq API KEY

---

### Backend Setup

```bash
cd backend
npm install

# Copy and configure environment variables
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ai-blog
JWT_SECRET=your_secret_key_here_make_it_long
GEMINI_API_KEY=your_groq_api_key
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev    # Development (with nodemon)
npm start      # Production
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit: `http://localhost:5173`

---

## 📁 Project Structure

```
ai-blog-app/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route handlers
│   │   ├── authController.js
│   │   ├── blogController.js
│   │   ├── commentController.js
│   │   └── aiController.js
│   ├── middleware/      # JWT auth middleware
│   ├── models/          # Mongoose schemas (User, Blog, Comment)
│   ├── routes/          # Express routers
│   ├── server.js        # Entry point
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── api/         # Axios instance
    │   ├── components/  # Navbar, BlogCard, AIAssistant, Comments
    │   ├── context/     # AuthContext
    │   └── pages/       # Home, Login, Register, Create, Edit, Detail, Dashboard, Profile
    ├── vite.config.js
    └── index.html
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/change-password` | Change password |

### Blogs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blogs` | Get all published blogs (paginated, filterable) |
| GET | `/api/blogs/trending` | Get trending blogs |
| GET | `/api/blogs/my` | Get my blogs (protected) |
| GET | `/api/blogs/:id` | Get single blog |
| POST | `/api/blogs` | Create blog (protected) |
| PUT | `/api/blogs/:id` | Update blog (protected) |
| DELETE | `/api/blogs/:id` | Delete blog (protected) |
| PUT | `/api/blogs/:id/like` | Toggle like (protected) |

### AI (all protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/generate-title` | Generate 5 titles |
| POST | `/api/ai/generate-content` | Generate full blog content |
| POST | `/api/ai/generate-summary` | Generate meta summary |
| POST | `/api/ai/generate-tags` | Generate tags |
| POST | `/api/ai/improve-grammar` | Improve grammar |
| POST | `/api/ai/seo-headlines` | SEO headline suggestions |
| POST | `/api/ai/suggest-intro` | Suggest intro paragraphs |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comments/:blogId` | Get comments |
| POST | `/api/comments/:blogId` | Add comment (protected) |
| DELETE | `/api/comments/:id` | Delete comment (protected) |

---

## 🚢 Deployment

### Frontend → Vercel / Netlify
```bash
cd frontend
npm run build
# Deploy the dist/ folder
```
Set env var: `VITE_API_URL=https://your-backend.onrender.com/api`

### Backend → Render / Railway
- Set all `.env` variables in the deployment dashboard
- Set build command: `npm install.`
- Set start command: `node server.js.`

---

## 📝 License
MIT
