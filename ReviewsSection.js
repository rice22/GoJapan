import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';

import { reviewsService } from '../services/reviewsService';

import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import EditReviewModal from './EditReviewModal';

const ReviewsSection = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const queryClient = useQueryClient();

  // Fetch reviews
  const { data: reviews = [], isLoading, error } = useQuery(
    'reviews',
    reviewsService.getAllReviews,
    { staleTime: 300000 }
  );

  // Create review mutation
  const createReviewMutation = useMutation(reviewsService.createReview, {
    onSuccess: () => {
      queryClient.invalidateQueries('reviews');
      setShowForm(false);
    }
  });

  // Update review mutation
  const updateReviewMutation = useMutation(reviewsService.updateReview, {
    onSuccess: () => {
      queryClient.invalidateQueries('reviews');
      setEditingReview(null);
    }
  });

  // Delete review
  const handleDelete = (id) => {
    reviewsService.deleteReview(id).then(() => {
      queryClient.invalidateQueries('reviews');
    });
  };

  return (
    <section>
      <h2>Reviews</h2>
      <button onClick={() => setShowForm(true)}>Add Review</button>
      <div>
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onEdit={() => setEditingReview(review)}
            onDelete={() => handleDelete(review.id)}
          />
        ))}
      </div>
      {showForm && (
        <ReviewForm
          onSubmit={(data) => {
            createReviewMutation.mutate(data);
          }}
          onCancel={() => setShowForm(false)}
          isLoading={createReviewMutation.isLoading}
        />
      )}
      {editingReview && (
        <EditReviewModal
          review={editingReview}
          onSubmit={(data) => {
            updateReviewMutation.mutate({ ...editingReview, ...data });
          }}
          onCancel={() => setEditingReview(null)}
          isLoading={updateReviewMutation.isLoading}
        />
      )}
    </section>
  );
};

export default ReviewsSection;
