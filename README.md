# HomeSer Frontend - React Application

A modern, responsive frontend for the household service platform built with React, Vite, and Tailwind CSS.

## 🚀 Features

- **Modern UI**: Built with React 18 and Tailwind CSS 3
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Authentication**: JWT-based user authentication with automatic token refresh
- **Service Catalog**: Browse and search household services with filtering
- **Shopping Cart**: Add/remove services with quantity management
- **Payment Integration**: SSLCOMMERZ payment gateway integration
- **User Dashboard**: Order history and profile management
- **Admin Dashboard**: Admin-only features for platform management
- **Reviews & Ratings**: Rate and review services after purchase
- **Real-time Updates**: Dynamic cart updates and notifications

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS 3** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Context API** - State management
- **Heroicons** - Beautiful SVG icons

## 📋 Prerequisites

- **Node.js** 16.0 or higher
- **npm** or **yarn** package manager
- **Backend API** running on http://localhost:8000

## ⚡ Quick Start

### Option 1: Automated Setup (Recommended)
```bash
cd homeser-frontend-react
chmod +x run_local.sh
./run_local.sh
```

### Option 2: Manual Setup
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at **http://localhost:3000**

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

For production deployment, update the API URL accordingly.

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 🏗️ Project Structure

```
homeser-frontend-react/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx      # Navigation component
│   │   └── Footer.jsx      # Footer component
│   ├── pages/              # Page components
│   │   ├── Home.jsx        # Landing page with 7 sections
│   │   ├── Services.jsx    # Service catalog
│   │   ├── ServiceDetail.jsx # Service details and reviews
│   │   ├── Cart.jsx        # Shopping cart
│   │   ├── Checkout.jsx    # Checkout process
│   │   ├── Login.jsx       # User login
│   │   ├── Register.jsx    # User registration
│   │   ├── Dashboard.jsx   # User dashboard
│   │   ├── AdminDashboard.jsx # Admin panel
│   │   ├── PaymentSuccess.jsx # Payment success page
│   │   ├── PaymentFail.jsx    # Payment failure page
│   │   └── PaymentCancel.jsx  # Payment cancellation
│   ├── context/            # React Context providers
│   │   ├── AuthContext.jsx # Authentication state
│   │   └── CartContext.jsx # Shopping cart state
│   ├── utils/              # Utility functions
│   │   └── api.js          # API client configuration
│   ├── App.jsx             # Main App component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles with Tailwind
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.js         # Vite configuration
├── run_local.sh          # Quick setup script
└── README.md             # This file
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue shades (#3b82f6, #2563eb, #1d4ed8)
- **Secondary**: Gray shades (#64748b, #475569, #334155)
- **Accent**: Yellow (#fbbf24) for highlights
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Responsive Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px and above

## 🏠 Landing Page Sections

The home page features 7 carefully designed sections:

1. **Hero Section** - Eye-catching banner with call-to-action
2. **Services Section** - Popular services showcase
3. **How It Works** - 3-step process explanation
4. **Features Section** - Platform benefits and guarantees
5. **Testimonials** - Customer reviews and ratings
6. **Stats Section** - Platform statistics
7. **CTA Section** - Final call-to-action

## 🔐 Authentication Flow

1. **Registration**: Users can create accounts with email verification
2. **Login**: JWT-based authentication with automatic token refresh
3. **Protected Routes**: Certain pages require authentication
4. **Role-based Access**: Admin features are restricted to admin users
5. **Auto-logout**: Automatic logout on token expiration

## 🛒 Shopping Cart Features

- **Add to Cart**: Add services with quantity selection
- **Update Quantity**: Increase/decrease item quantities
- **Remove Items**: Remove services from cart
- **Real-time Totals**: Automatic price calculation with tax
- **Persistent Cart**: Cart persists across browser sessions
- **Empty State**: User-friendly empty cart messaging

## 💳 Payment Integration

### SSLCOMMERZ Integration
- **Sandbox Mode**: Configured for testing
- **Payment Flow**: Seamless checkout to payment gateway
- **Result Handling**: Success, failure, and cancellation pages
- **Order Tracking**: Real-time order status updates

### Test Payment Details
```
VISA Card: 4111111111111111
CVV: 111
Expiry: 12/25
OTP: 111111

MasterCard: 5111111111111111
CVV: 111
Expiry: 12/25
OTP: 123456
```

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Mobile Devices**: Touch-friendly interface with collapsible navigation
- **Tablets**: Optimized layout for medium screens
- **Desktops**: Full-featured interface with hover effects
- **Accessibility**: ARIA labels and keyboard navigation support

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

4. **Set environment variables** in Vercel dashboard:
   ```
   VITE_API_BASE_URL=https://your-backend-domain.com/api
   ```

### Other Hosting Platforms

The built files in the `dist/` folder can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3
- Firebase Hosting

## 🧪 Testing

### Manual Testing
Follow the comprehensive testing guide in the backend repository's `demo_steps.txt` file.

### Key Test Scenarios
- User registration and authentication
- Service browsing and filtering
- Cart functionality
- Checkout process
- Payment flow (sandbox)
- Responsive design on different devices

## 🔧 API Integration

The frontend communicates with the Django backend through RESTful APIs:

### Authentication Endpoints
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login

### Service Endpoints
- `GET /api/services/` - List services
- `GET /api/services/{id}/` - Service details
- `POST /api/services/{id}/reviews/` - Create review

### Cart & Order Endpoints
- `GET /api/cart/` - Get cart
- `POST /api/cart/add/` - Add to cart
- `POST /api/orders/checkout/` - Checkout

## 🎯 Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Responsive images with proper sizing
- **Bundle Analysis**: Optimized bundle size with Vite
- **Caching**: API response caching for better performance

## 🐛 Troubleshooting

### Common Issues

**CORS Errors**
```bash
# Ensure backend CORS settings allow frontend domain
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

**API Connection Issues**
```bash
# Check if backend is running
curl http://localhost:8000/api/services/
```

**Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Environment Variables Not Loading**
```bash
# Ensure .env file exists and variables start with VITE_
cp .env.example .env
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly on different devices
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section above
- Review the backend API documentation
- Create an issue in the repository
- Contact the development team

## 📄 License

This project is part of the HomeSer household service platform.

---

**Built with ❤️ using React, Vite, and Tailwind CSS**

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
