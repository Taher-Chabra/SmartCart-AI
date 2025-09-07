# SmartCart AI 🛒🤖

> An intelligent e-commerce platform powered by AI for smarter shopping experiences

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🌟 About The Project

SmartCart AI is a next-generation e-commerce platform that combines the power of artificial intelligence with modern web technologies to create an intelligent shopping ecosystem. Our platform serves multiple stakeholders - customers, sellers, and administrators - each with tailored experiences designed to optimize their specific needs.

### 💡 The Idea Behind SmartCart AI

In today's rapidly evolving digital marketplace, traditional e-commerce platforms often lack the intelligence to truly understand user behavior and preferences. SmartCart AI bridges this gap by:

- **Intelligent Product Discovery**: Leveraging AI to help customers find exactly what they need
- **Smart Seller Tools**: Providing data-driven insights for better business decisions
- **Automated Operations**: Streamlining administrative tasks through intelligent automation
- **Personalized Experiences**: Creating unique shopping journeys for every user

## 🚀 Key Features

### For Customers

- 🛍️ **Smart Shopping Cart** with AI-powered recommendations
- ❤️ **Intelligent Wishlist** management
- 📦 **Real-time Order Tracking** with status updates
- ⭐ **Product Reviews & Ratings** system
- 🏠 **Address Management** for seamless checkout
- 🌙 **Dark/Light Theme** support

### For Sellers

- 📊 **Business Dashboard** with analytics
- 🏪 **Product Catalog Management** with variants support
- 📋 **Order Management** and fulfillment tools
- 💰 **Payment History** and financial tracking
- 📄 **Business Verification** system
- 📈 **Performance Analytics** and insights

### For Administrators

- 🎛️ **Platform Management** dashboard
- 👥 **User Role Management** (Customer/Seller/Admin)
- 🔐 **Permission-based Access Control**
- 📊 **Platform Analytics** and monitoring
- 🛡️ **Content Moderation** tools

## 🏗️ Technology Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Zustand** - Lightweight state management
- **Lucide React** - Beautiful icons

### Backend

- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Redis** - In-memory caching and session store
- **JWT** - Secure authentication tokens
- **Passport.js** - Authentication middleware
- **Cloudinary** - Cloud-based image management

### Development Tools

- **PNPM Workspaces** - Monorepo package management
- **ESLint & Prettier** - Code linting and formatting
- **Nodemon** - Development server auto-restart
- **TypeScript Compiler** - Type checking and compilation

## 📁 Project Structure

```
smartcart-ai/
├── app/
│   ├── frontend/          # Next.js React application
│   │   ├── src/
│   │   │   ├── app/       # App Router pages
│   │   │   ├── components/ # Reusable UI components
│   │   │   ├── lib/       # Utility functions
│   │   │   └── store/     # State management
│   │   └── public/        # Static assets
│   └── backend/           # Express.js API server
│       └── src/
│           ├── controllers/ # Route handlers
│           ├── models/     # Database schemas
│           ├── routes/     # API route definitions
│           ├── middlewares/ # Custom middleware
│           └── utils/      # Helper functions
├── shared/                # Common TypeScript interfaces
│   └── src/
│       └── interface/     # Shared type definitions
└── package.json          # Root package configuration
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- PNPM (v8 or higher)
- MongoDB (v6 or higher)
- Redis (v6 or higher)

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/Taher-Chabra/SmartCart-AI.git
   cd SmartCart-AI
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**

   ```bash
   # Backend environment variables
   cp app/backend/.env.example app/backend/.env

   # Frontend environment variables
   cp app/frontend/.env.example app/frontend/.env.local
   ```

4. **Start development servers**

   ```bash
   # Start both frontend and backend concurrently
   pnpm run dev

   # Or start individually
   pnpm run dev:frontend  # Frontend only
   pnpm run dev:backend   # Backend only
   ```

5. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`

## 🎯 Development Status

> **⚠️ Project Status: In Active Development**

SmartCart AI is currently under active development. While core functionalities are implemented, we're continuously adding new features and improvements. The following features are available:

✅ **Completed**

- User authentication and role-based access
- Product catalog management
- Shopping cart and wishlist functionality
- Order processing and tracking
- Payment integration
- Review and rating system
- Responsive UI with theme support

🚧 **In Progress**

- AI-powered recommendation engine
- Advanced analytics dashboard
- Enhanced search functionality
- Mobile application
- Performance optimizations

📋 **Planned**

- Machine learning integration
- Real-time notifications
- Multi-language support
- Advanced reporting tools
- Third-party integrations

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Taher Chabra**

- GitHub: [@Taher-Chabra](https://github.com/Taher-Chabra)
- LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/your-profile)

## 🙏 Acknowledgments

- Thanks to all the open-source libraries that made this project possible
- Special thanks to the React and Node.js communities
- Inspiration from modern e-commerce platforms and AI innovations

---

<div align="center">
  <p>Built with ❤️ and ☕ by Taher Chabra</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
