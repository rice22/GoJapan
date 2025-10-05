import React, { useState } from 'react';

const EditReviewModal = ({ review, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    reviewerName: review.reviewerName || '',
    reviewerLocation: review.reviewerLocation || '',
    reviewText: review.reviewText || '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.reviewerName || !formData.reviewerLocation || !formData.reviewText) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const updateData = {
        reviewerName: formData.reviewerName,
        reviewerLocation: formData.reviewerLocation,
        reviewText: formData.reviewText,
      };

      // Handle new profile picture
      if (profilePicture) {
        updateData.profilePicture = await fileToBase64(profilePicture);
      }

      // Handle new review images
      if (reviewImages.length > 0) {
        updateData.reviewImages = await Promise.all(
          reviewImages.map((file) => fileToBase64(file))
        );
      }

      onSubmit(updateData);
    } catch (error) {
      console.error('Error processing images', error);
    }
  };

  return (
    <div className="modal">
      <h2>Edit Review</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Your Name *
          <input
            type="text"
            name="reviewerName"
            value={formData.reviewerName}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Your Location *
          <input
            type="text"
            name="reviewerLocation"
            value={formData.reviewerLocation}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Your Review *
          <textarea
            name="reviewText"
            value={formData.reviewText}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          New Profile Picture
          <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
        </label>

        {!profilePicture && review.profilePicture && (
          <div>
            <p>Current profile picture</p>
            <img src={review.profilePicture} alt="Current profile" />
          </div>
        )}

        <label>
          Add More Images
          <input type="file" accept="image/*" multiple onChange={handleReviewImagesChange} />
        </label>

        {/* Current images */}
        {review.reviewImages && review.reviewImages.length > 0 && (
          <div>
            <p>Current Images:</p>
            {review.reviewImages.map((image, index) => (
              <img key={index} src={image} alt={`Review image ${index + 1}`} />
            ))}
          </div>
        )}

        {/* New image previews */}
        {previewImages.length > 0 && (
          <div>
            <p>New Images:</p>
            {previewImages.map((preview, index) => (
              <img key={index} src={preview} alt={`New review image ${index + 1}`} />
            ))}
          </div>
        )}

        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">{isLoading ? 'Updating...' : 'Update Review'}</button>
      </form>
    </div>
  );
};

export default EditReviewModal;
