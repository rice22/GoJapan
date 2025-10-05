# Go Japan - Fullstack Setup Guide

This guide will help you set up the complete Go Japan travel guide application with both frontend and backend.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)
- Git

## Quick Start

### 1. Frontend Setup

```bash
# Navigate to the React project
cd travel-guide-react

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will be available at `http://localhost:3000`

### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Copy environment variables
cp env.example .env

# Edit the .env file with your configuration
# Set MONGODB_URI to your MongoDB connection string

# Start the backend server
npm run dev
```

The backend API will be available at `http://localhost:3001`

## Detailed Setup Instructions

### Frontend Configuration

The React application is already configured with:

- **React Router** for navigation
- **Framer Motion** for animations
- **React Query** for data fetching
- **TypeScript** for type safety
- **Responsive CSS** for mobile support

#### Key Features Implemented:

1. **Hero Section** - Interactive card carousel
2. **Gallery Section** - Dynamic image gallery with modals
3. **Seasons Section** - Interactive shoji doors with particle effects
4. **Map Section** - SVG-based Japan map with prefecture information
5. **Reviews Section** - Full CRUD functionality with offline support
6. **Fortune Cookie** - Interactive element with animations

### Backend Configuration

The Express.js backend includes:

- **RESTful API** for reviews management
- **MongoDB** integration with Mongoose
- **Input validation** with express-validator
- **Rate limiting** for API protection
- **CORS** configuration for frontend communication
- **Error handling** middleware

#### API Endpoints:

- `GET /api/reviews` - Get all reviews (with pagination)
- `GET /api/reviews/:id` - Get single review
- `POST /api/reviews` - Create new review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `POST /api/reviews/:id/like` - Like a review

### Database Setup

#### Option 1: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Set `MONGODB_URI=mongodb://localhost:27017/go-japan` in your `.env` file

#### Option 2: MongoDB Atlas (Recommended)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Set `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/go-japan` in your `.env` file

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/go-japan
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE=10485760
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Asset Migration

To complete the setup, you'll need to migrate assets from the original website:

### 1. Copy Images

Copy the following directories from your original website to `public/assets/`:

```
public/assets/
├── hero/           # Hero section images
├── gallery/        # Gallery images
├── seasons/        # Seasonal images
├── prefectures/    # Prefecture images
├── elements/       # UI elements and logos
└── background.jpeg # Background images
```

### 2. Update Image Paths

Update the image paths in the React components to match your asset structure:

- `HeroSection.tsx` - Update hero card images
- `GallerySection.tsx` - Update gallery images
- `SeasonsSection.tsx` - Update seasonal images
- `MapSection.tsx` - Update prefecture images

## Development Workflow

### Running Both Frontend and Backend

1. **Terminal 1 - Frontend:**
   ```bash
   cd travel-guide-react
   npm start
   ```

2. **Terminal 2 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```

### Testing the API

You can test the API endpoints using:

- **Postman** - Import the API collection
- **curl** commands
- **Browser** - Visit `http://localhost:3001/api/health`

Example API calls:

```bash
# Get all reviews
curl http://localhost:3001/api/reviews

# Create a new review
curl -X POST http://localhost:3001/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "reviewerName": "John Doe",
    "reviewerLocation": "New York, USA",
    "reviewText": "Amazing experience in Japan!",
    "profilePicture": "data:image/svg+xml;base64,...",
    "reviewImages": []
  }'
```

## Production Deployment

### Frontend Deployment (Netlify/Vercel)

1. Build the React app:
   ```bash
   npm run build
   ```

2. Deploy the `build` folder to your hosting service

3. Set environment variables:
   - `REACT_APP_API_URL=https://your-backend-url.com/api`

### Backend Deployment (Heroku/Railway)

1. Create a production `.env` file
2. Set up MongoDB Atlas for production
3. Deploy using your preferred platform
4. Configure CORS for your production frontend URL

## Features Overview

### ✅ Implemented Features

- [x] React.js frontend with TypeScript
- [x] Interactive hero section with carousel
- [x] Dynamic gallery with modal views
- [x] Seasonal information with particle effects
- [x] Interactive Japan map
- [x] Reviews system with CRUD operations
- [x] Offline support for reviews
- [x] Responsive design
- [x] Express.js backend API
- [x] MongoDB integration
- [x] Input validation
- [x] Rate limiting
- [x] Error handling

### 🚀 Future Enhancements

- [ ] User authentication system
- [ ] Real-time chat functionality
- [ ] Advanced search and filtering
- [ ] Progressive Web App (PWA) features
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Advanced animations
- [ ] Image optimization
- [ ] SEO optimization
- [ ] Performance monitoring

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `FRONTEND_URL` is set correctly in backend `.env`
   - Check that the frontend is running on the correct port

2. **Database Connection Issues**
   - Verify MongoDB is running (if using local)
   - Check MongoDB Atlas connection string
   - Ensure network access is configured

3. **Image Loading Issues**
   - Verify image paths are correct
   - Check that images are in the `public` directory
   - Ensure proper file permissions

4. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for TypeScript errors
   - Verify all dependencies are installed

### Getting Help

- Check the console for error messages
- Review the network tab in browser dev tools
- Check backend logs for API errors
- Ensure all environment variables are set correctly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
