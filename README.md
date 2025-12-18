# 🛒 Fullstack E-commerce Project

Modern e-commerce platform with admin panel built with Next.js and Express.

![TypeScript](https://img.shields.io/badge/TypeScript-73.3%25-blue)
![CSS](https://img.shields.io/badge/CSS-26.3%25-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### User Features
- 🔐 JWT Authentication (Register/Login)
- 🛍️ Product catalog with search
- 🛒 Shopping cart management
- 📦 Order placement and tracking
- 👤 User profile management

### Admin Features
- 📊 Dashboard with statistics
- 📦 Product management (CRUD)
- 👥 User management
- 📋 Order management with status updates

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** — React framework with App Router
- **React 18** — UI library
- **TypeScript** — Type safety
- **CSS Modules** — Scoped styling

### Backend
- **Express 4** — Node.js web framework
- **MongoDB** — Database
- **Mongoose 8** — ODM
- **JWT** — Authentication

### Security
- **Helmet** — HTTP security headers
- **Rate Limiting** — Brute force protection
- **bcrypt** — Password hashing
- **express-mongo-sanitize** — NoSQL injection prevention

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone repository
git clone https://github.com/Brin39/Fullstack-Project.git
cd Fullstack-Project/my-app

# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install
```

### Environment Setup

Create `.env` files based on `.env.example`:

```bash
# Root .env.example already provided
cp ../.env.example .env
```

Required variables:
```env
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000

# Backend (in server folder)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/myshop
JWT_SECRET=your_secret_key_min_32_chars
ADMIN_CREATION_CODE=your_admin_secret
CORS_ORIGINS=http://localhost:3000
```

### Run Development

```bash
# Terminal 1 — Frontend (from my-app folder)
npm run dev

# Terminal 2 — Backend (from my-app/server folder)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
my-app/
├── app/                    # Next.js App Router
│   ├── (admin)/           # Admin routes (protected)
│   │   └── admin/
│   │       ├── orders/    # Order management
│   │       ├── products/  # Product management
│   │       └── users/     # User management
│   ├── (auth)/            # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── (user)/            # User routes (protected)
│   │   ├── cart/          # Shopping cart
│   │   └── user/          # User dashboard
│   ├── components/        # Shared components
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
│
└── server/                # Express backend
    ├── controllers/       # Route handlers
    ├── middleware/        # Auth, validation
    ├── models/            # Mongoose schemas
    ├── routes/            # API routes
    └── config/            # Database config
```

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | Login user |
| GET | `/api/users/profile` | Get user profile |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/search` | Search products |
| GET | `/api/products/:id` | Get product by ID |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user cart |
| POST | `/api/cart` | Add to cart |
| PUT | `/api/cart/update/:id` | Update quantity |
| DELETE | `/api/cart/:id` | Remove item |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get user orders |
| POST | `/api/orders` | Create order |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard stats |
| GET | `/api/admin/users` | List users |
| GET | `/api/admin/products` | List products |
| GET | `/api/admin/orders` | List orders |

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Brin39** — [GitHub](https://github.com/Brin39)
