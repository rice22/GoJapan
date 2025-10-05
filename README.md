# Go Japan - React Travel Guide

A modern React.js application converted from the original HTML/CSS/JavaScript travel guide website. This fullstack application provides an interactive guide to Japan with features like reviews, seasonal information, interactive maps, and more.

## Features

- **Interactive Hero Section** - Card carousel with smooth transitions
- **Dynamic Gallery** - Image gallery with modal views
- **Seasonal Information** - Interactive shoji doors with seasonal effects
- **Interactive Japan Map** - SVG-based map with prefecture information
- **Reviews System** - Full CRUD functionality with image uploads
- **Responsive Design** - Mobile-friendly interface
- **Modern Animations** - Framer Motion animations throughout
- **Offline Support** - Reviews work offline and sync when online

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Framer Motion** for animations
- **React Query** for data fetching
- **Styled Components** for styling
- **React Hook Form** for form management

### Backend (To be implemented)
- **Node.js** with Express
- **MongoDB** or **PostgreSQL** for data storage
- **Multer** for file uploads
- **JWT** for authentication

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── HeroSection.tsx
│   ├── GallerySection.tsx
│   ├── SeasonsSection.tsx
│   ├── MapSection.tsx
│   ├── ReviewsSection.tsx
│   ├── FortuneCookie.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ReviewCard.tsx
│   ├── ReviewForm.tsx
│   └── EditReviewModal.tsx
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── ArticlePage.tsx
│   └── SeasonPage.tsx
├── services/           # API services
│   └── reviewsService.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── styles/             # Global styles
│   └── index.css
├── assets/             # Static assets
├── hooks/              # Custom React hooks
├── App.tsx             # Main App component
└── index.tsx           # Entry point
```

## Key Components

### HeroSection
- Interactive card carousel
- Smooth background transitions
- Responsive design
- Auto-cycling with manual controls

### ReviewsSection
- Full CRUD operations
- Image upload with preview
- Offline support with local storage
- Real-time updates with React Query

### SeasonsSection
- Interactive shoji doors
- Seasonal particle effects (sakura, snow, leaves, fireflies)
- Dynamic content switching
- Smooth animations

### MapSection
- SVG-based Japan map
- Hover effects and tooltips
- Modal information display
- Responsive design

## Data Management

The application uses React Query for:
- Caching API responses
- Background refetching
- Optimistic updates
- Error handling
- Loading states

## Styling

- CSS modules for component-specific styles
- Global styles for common elements
- Responsive design with mobile-first approach
- Smooth transitions and hover effects

## Backend Integration

The application is designed to work with a REST API. The `reviewsService.ts` file contains:
- API calls for CRUD operations
- Fallback to local storage for offline support
- Error handling and retry logic

## Deployment

### Build for Production
```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Deploy to Netlify/Vercel
1. Connect your GitHub repository
2. Set build command to `npm run build`
3. Set publish directory to `build`
4. Deploy!

## Future Enhancements

- [ ] Backend API implementation
- [ ] User authentication
- [ ] Real-time chat
- [ ] Advanced search functionality
- [ ] Progressive Web App (PWA) features
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Advanced animations
- [ ] Performance optimizations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Original Website

This React application is converted from the original HTML/CSS/JavaScript travel guide website. The original website featured:
- Complex animations and effects
- Interactive elements
- Rich media content
- Responsive design

All original functionality has been preserved and enhanced with modern React patterns and TypeScript.
