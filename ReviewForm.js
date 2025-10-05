import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ReviewForm = ({ onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    reviewerName: '',
    reviewerLocation: '',
    reviewText: '',
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [reviewImages, setReviewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  const handleReviewImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setReviewImages(files);
    // Create preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result);
      reader.readAsDataURL(file);
    });
  };

  const getDefaultAvatar = () => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return `data:image/svg+xml;base64,${btoa(
      `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="${randomColor}" /></svg>`
    )}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.reviewerName || !formData.reviewerLocation || !formData.reviewText) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Convert images to base64
      const profilePictureBase64 = profilePicture ? await fileToBase64(profilePicture) : getDefaultAvatar();
      const reviewImagesBase64 = await Promise.all(reviewImages.map((file) => fileToBase64(file)));

      const reviewData = {
        reviewerName: formData.reviewerName,
        reviewerLocation: formData.reviewerLocation,
        reviewText: formData.reviewText,
        profilePicture: profilePictureBase64,
        reviewImages: reviewImagesBase64,
      };

      onSubmit(reviewData);
    } catch (error) {
      console.error('Error processing images:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Write a Review</h2>
      <label>
        Your Name *
        <input type="text" name="reviewerName" value={formData.reviewerName} onChange={handleInputChange} required />
      </label>

      <label>
        Your Location *
        <input type="text" name="reviewerLocation" value={formData.reviewerLocation} onChange={handleInputChange} required />
      </label>

      <label>
        Your Review *
        <textarea name="reviewText" value={formData.reviewText} onChange={handleInputChange} required />
      </label>

      <label>
        Profile Picture
        <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
      </label>

      <label>
        Review Images
        <input type="file" accept="image/*" multiple onChange={handleReviewImagesChange} />
      </label>

      {previewImages.length > 0 && (
        <div>
          {previewImages.map((preview, index) => (
            <img key={index} src={preview} alt={`Preview ${index + 1}`} />
          ))}
        </div>
      )}

      <button type="button" onClick={onCancel}>Cancel</button>
      <button type="submit">{isLoading ? 'Submitting...' : 'Submit Review'}</button>
    </form>
  );
};

export default ReviewForm;
