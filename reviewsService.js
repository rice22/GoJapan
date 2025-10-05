import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const reviewsService = {
  // Get all reviews
  getAllReviews: async () => {
    try {
      const response = await api.get('/reviews');
      return response.data;
    } catch (error) {
      // Fallback to local storage if API fails
      const localReviews = localStorage.getItem('goJapanReviews');
      return localReviews ? JSON.parse(localReviews) : [];
    }
  },

  // Create a new review
  createReview: async (reviewData) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      // Fallback to local storage
      const newReview = {
        ...reviewData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isOffline: true,
      };
      const localReviews = JSON.parse(localStorage.getItem('goJapanReviews') || '[]');
      localReviews.unshift(newReview);
      localStorage.setItem('goJapanReviews', JSON.stringify(localReviews));
      return newReview;
    }
  },

  // Update a review
  updateReview: async (id, reviewData) => {
    try {
      const response = await api.put(`/reviews/${id}`, reviewData);
      return response.data;
    } catch (error) {
      // Fallback to local storage
      const localReviews = JSON.parse(localStorage.getItem('goJapanReviews') || '[]');
      const reviewIndex = localReviews.findIndex((r) => r.id === id);
      if (reviewIndex !== -1) {
        localReviews[reviewIndex] = {
          ...localReviews[reviewIndex],
          ...reviewData,
          updatedAt: new Date().toISOString(),
          isOffline: true,
        };
        localStorage.setItem('goJapanReviews', JSON.stringify(localReviews));
        return localReviews[reviewIndex];
      } else {
        throw new Error('Review not found');
      }
    }
  },

  // Delete a review
  deleteReview: async (id) => {
    try {
      await api.delete(`/reviews/${id}`);
    } catch (error) {
      // Fallback to local storage
      const localReviews = JSON.parse(localStorage.getItem('goJapanReviews') || '[]');
      const filteredReviews = localReviews.filter((r) => r.id !== id);
      localStorage.setItem('goJapanReviews', JSON.stringify(filteredReviews));
    }
  },

  // Sync offline reviews
  syncOfflineReviews: async () => {
    const localReviews = JSON.parse(localStorage.getItem('goJapanReviews') || '[]');
    const offlineReviews = localReviews.filter((r) => r.isOffline);

    for (const review of offlineReviews) {
      try {
        await api.post('/reviews', review);
        review.isOffline = false;
      } catch (error) {
        console.error('Error syncing review:', error);
      }
    }

    localStorage.setItem('goJapanReviews', JSON.stringify(localReviews));
  },
};
