# Peygwen - Premium Fashion E-commerce Platform

A modern, full-stack e-commerce platform built for selling clothing, shoes, and jewelry with international support, product variants, and advanced features.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** - Secure login/signup with JWT tokens
- **Product Management** - Full CRUD operations for products, categories, and brands
- **Shopping Cart** - Persistent cart with localStorage support
- **Order Management** - Complete order processing and tracking system
- **Admin Panel** - Comprehensive admin dashboard for managing products, users, and orders
- **Search & Filtering** - Advanced product search and filtering capabilities
- **Favorites/Wishlist** - Save favorite products for later

### Advanced Features
- **Product Variants** - Support for sizes (S, M, L, XL), gender selection (Men/Women), and international jewelry sizing
- **Dynamic Product Images** - Automatic image fetching from Unsplash API with intelligent caching
- **Internationalization (i18n)** - Multi-language support (English, Turkish, Spanish, German, French, Russian, Portuguese)
- **Dark/Light Theme** - Beautiful theme toggle with drag animation
- **Discount System** - Support for discounted products with original and discounted prices
- **SEO Optimized** - Meta tags, semantic HTML, and proper heading hierarchy
- **Security Hardened** - XSS protection, input validation, and secure API practices

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js** - RESTful API server
- **TypeScript** - Type-safe backend development
- **Prisma ORM** - Database management and migrations
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Frontend
- **React 19** - Modern UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Toastify** - Notification system
- **Lucide React** - Icon library

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **Git**

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd salihin-projesi
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create a .env file in the backend directory
cp .env.example .env  # If you have an example file, or create manually
```

Configure your `.env` file with the following variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
UNSPLASH_ACCESS_KEY="your-unsplash-access-key"  # Optional, for product images
PORT=5000
```

**Get Unsplash Access Key (Optional):**
1. Visit [Unsplash Developers](https://unsplash.com/developers)
2. Create an account and register a new application
3. Copy your Access Key to the `.env` file

```bash
# Run database migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# (Optional) Seed database with sample products
npm run seed

# Start development server
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create a .env file in the frontend directory
```

Configure your `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_UNSPLASH_ACCESS_KEY="your-unsplash-access-key"  # Optional
```

```bash
# Start development server
npm start
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
salihin-projesi/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middlewares/     # Express middlewares
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   ├── app.ts           # Express app configuration
│   │   └── server.ts        # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── migrations/      # Database migrations
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── i18n/           # Internationalization
│   │   ├── utils/          # Utility functions
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   └── package.json
│
└── README.md
```

## 🗄️ Database Schema

### Key Models
- **User** - User accounts with admin support
- **Product** - Products with variants, pricing, and images
- **Category** - Product categories
- **Brand** - Product brands
- **Order** - Customer orders
- **OrderItem** - Order line items with variants
- **ContactMessage** - Contact form submissions

### Product Variants
Products support different variant types:
- **Clothing**: Size variants (S, M, L, XL)
- **Shoes**: Gender (Men/Women) + Size (EU 35-45)
- **Jewelry**: International sizing (ring sizes, necklace lengths, etc.)

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `GET /api/products/discounted` - Get discounted products

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details

### Categories & Brands
- `GET /api/categories` - Get all categories
- `GET /api/brands` - Get all brands

## 🎨 Features in Detail

### Product Variants
Products can have variants stored as JSON:
```json
{
  "sizes": ["S", "M", "L", "XL"],
  "gender": ["Men", "Women"],
  "jewelrySizes": ["US 6", "US 7", "US 8"]
}
```

### Image Service
- Automatically fetches product images from Unsplash based on product name
- Implements caching (7 days) to reduce API calls
- Falls back to placeholder if API unavailable

### Internationalization
- Supports 7 languages: EN, TR, ES, DE, FR, RU, PT
- Dynamic content translation for product names, descriptions, categories
- Language preference stored in localStorage

### Theme System
- Dark/Light mode toggle with smooth transitions
- Theme preference persisted in localStorage
- Drag animation for theme switcher

## 🔒 Security Features

- **XSS Protection** - HTML sanitization for user inputs
- **SQL Injection Prevention** - Parameterized queries via Prisma
- **Input Validation** - Comprehensive validation middleware
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs with salt rounds
- **CORS Configuration** - Proper CORS setup
- **Environment Variables** - Sensitive data in .env files

## 🚀 Deployment

### Backend Deployment

1. Build TypeScript:
```bash
cd backend
npm run build
```

2. Set production environment variables
3. Run migrations:
```bash
npx prisma migrate deploy
```

4. Start server:
```bash
npm start
```

### Frontend Deployment

1. Build React app:
```bash
cd frontend
npm run build
```

2. Deploy the `build` folder to your hosting service (Vercel, Netlify, etc.)

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-key
UNSPLASH_ACCESS_KEY=your-key
PORT=5000
NODE_ENV=production
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_UNSPLASH_ACCESS_KEY=your-key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Development Team

## 🙏 Acknowledgments

- Unsplash for product images
- Prisma for excellent ORM
- React team for the amazing framework
- Tailwind CSS for beautiful styling

## 📞 Support

For support, email support@peygwen.com or open an issue in the repository.

---

**Note**: Remember to change default JWT secrets and database credentials in production!
