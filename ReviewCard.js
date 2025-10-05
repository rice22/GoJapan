import React from 'react';

const ReviewCard = ({ review, onEdit, onDelete }) => {
  return (
    <div className="review-card">
      <div className="review-header">
        <h3>{review.reviewerName}</h3>
        <button onClick={onEdit} title="Edit Review">✏️</button>
        <button onClick={onDelete} title="Delete Review">🗑️</button>
      </div>
      <p>{review.reviewText}</p>
      {review.reviewImages &&
        review.reviewImages.map((image, index) => (
          <img key={index} src={image} alt={`Review image ${index + 1}`} style={{ width: '100px', marginRight: '10px' }} />
        ))}
      <p>{review.reviewerLocation}</p>
    </div>
  );
};

export default ReviewCard;
