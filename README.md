# HomeSer Frontend

A modern, responsive frontend for the HomeSer household service platform built with React, Vite, and Tailwind CSS.

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
- **Backend API** running (see backend repository for setup)

## Quick Start

### Manual Setup
```bash
npm install
cp .env.example .env  # If .env doesn't exist
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
- `npm run lint` - Run Biome for code quality

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using React, Vite, and Tailwind CSS**