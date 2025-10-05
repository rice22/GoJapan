// Reviews Management System
class ReviewsManager {
    constructor() {
        this.reviews = this.loadReviews();
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderReviews();
        this.addSampleReviews();
    }

    bindEvents() {
        // Form submission
        document.getElementById('review-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createReview();
        });

        // Edit modal events
        document.getElementById('close-edit-modal').addEventListener('click', () => {
            this.closeEditModal();
        });

        document.getElementById('cancel-edit').addEventListener('click', () => {
            this.closeEditModal();
        });

        document.getElementById('edit-review-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateReview();
        });

        // Image preview for new review
        document.getElementById('profile-picture').addEventListener('change', (e) => {
            this.previewImage(e, 'preview-img', 'image-preview');
        });

        // Image preview for edit review
        document.getElementById('edit-profile-picture').addEventListener('change', (e) => {
            this.previewImage(e, 'edit-preview-img', 'edit-image-preview');
        });

        // Review images preview for new review
        document.getElementById('review-images').addEventListener('change', (e) => {
            this.previewReviewImages(e, 'review-images-preview');
        });

        // Review images preview for edit review
        document.getElementById('edit-review-images').addEventListener('change', (e) => {
            this.previewReviewImages(e, 'edit-review-images-preview');
        });

        // Star rating events
        this.initializeStarRating();
        this.initializeEditStarRating();

        // Close modal when clicking outside
        document.getElementById('edit-modal').addEventListener('click', (e) => {
            if (e.target.id === 'edit-modal') {
                this.closeEditModal();
            }
        });

        // Close image modal when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('image-modal')) {
                this.closeImageModal();
            }
        });
    }

    // CREATE - Add new review
    async createReview() {
        try {
            const formData = new FormData(document.getElementById('review-form'));
            const profilePictureFile = document.getElementById('profile-picture').files[0];
            const reviewImagesFiles = Array.from(document.getElementById('review-images').files);
            
            // Validate required fields
            const reviewerName = formData.get('reviewerName').trim();
            const reviewerLocation = formData.get('reviewerLocation').trim();
            const reviewText = formData.get('reviewText').trim();
            const rating = parseInt(formData.get('rating')) || 0;
            
            if (!reviewerName || !reviewerLocation || !reviewText) {
                this.showNotification('Please fill in all required fields (Name, Location, and Review)', 'error');
                return;
            }
            
            if (rating === 0) {
                this.showNotification('Please select a rating for your experience', 'error');
                return;
            }
            
            // Convert images to base64 (only if files exist)
            const profilePicture = profilePictureFile ? await this.fileToBase64(profilePictureFile) : this.getDefaultAvatar();
            const reviewImages = reviewImagesFiles.length > 0 ? await Promise.all(reviewImagesFiles.map(file => this.fileToBase64(file))) : [];
            
            const review = {
                id: Date.now().toString(),
                reviewerName: reviewerName,
                reviewerLocation: reviewerLocation,
                reviewText: reviewText,
                rating: rating,
                profilePicture: profilePicture,
                reviewImages: reviewImages,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            this.reviews.unshift(review);
            this.saveReviews();
            this.renderReviews();
            this.resetForm();
            this.showNotification('Review added successfully!', 'success');
        } catch (error) {
            console.error('Error creating review:', error);
            this.showNotification('Error creating review. Please try again.', 'error');
        }
    }

    // READ - Display all reviews
    renderReviews() {
        const container = document.getElementById('reviews-container');
        container.innerHTML = '';

        if (this.reviews.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="text-gray-500 text-lg">No reviews yet. Be the first to share your experience!</div>
                </div>
            `;
            return;
        }

        this.reviews.forEach((review, index) => {
            const reviewCard = this.createReviewCard(review, index);
            container.appendChild(reviewCard);
        });
    }

    createReviewCard(review, index) {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.dataset.reviewId = review.id;

        // Create review images HTML if images exist
        let reviewImagesHtml = '';
        if (review.reviewImages && review.reviewImages.length > 0) {
            reviewImagesHtml = `
                <div class="review-images">
                    ${review.reviewImages.map((image, imgIndex) => `
                        <div class="review-image-preview">
                            <img src="${image}" alt="Review image ${imgIndex + 1}" class="review-image" 
                                 onclick="reviewsManager.openImageModal('${image}')">
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // Create rating HTML
        const ratingHtml = this.createRatingHtml(review.rating || 0);

        card.innerHTML = `
            <div class="review-actions">
                <button class="edit-btn" onclick="reviewsManager.editReview('${review.id}')" title="Edit Review">
                    ✏️
                </button>
                <button class="delete-btn" onclick="reviewsManager.deleteReview('${review.id}')" title="Delete Review">
                    🗑️
                </button>
            </div>
            ${ratingHtml}
            <div class="review-text">${this.escapeHtml(review.reviewText)}</div>
            ${reviewImagesHtml}
            <div class="reviewer-info">
                <img src="${review.profilePicture}" alt="${review.reviewerName}" class="reviewer-avatar">
                <div class="reviewer-details">
                    <h4>${this.escapeHtml(review.reviewerName)}</h4>
                    <p>${this.escapeHtml(review.reviewerLocation)}</p>
                </div>
            </div>
        `;

        return card;
    }

    // UPDATE - Edit existing review
    editReview(reviewId) {
        const review = this.reviews.find(r => r.id === reviewId);
        if (!review) return;

        this.currentEditId = reviewId;
        
        // Populate edit form
        document.getElementById('edit-review-id').value = reviewId;
        document.getElementById('edit-reviewer-name').value = review.reviewerName;
        document.getElementById('edit-reviewer-location').value = review.reviewerLocation;
        document.getElementById('edit-review-text').value = review.reviewText;
        
        // Set rating
        this.setRating(review.rating || 0, '.edit-star-rating', document.getElementById('edit-rating-text'));
        
        // Set current profile picture
        const editPreviewImg = document.getElementById('edit-preview-img');
        editPreviewImg.src = review.profilePicture;
        document.getElementById('edit-image-preview').style.display = 'block';

        // Display current review images
        this.displayCurrentReviewImages(review.reviewImages || []);

        // Show modal
        document.getElementById('edit-modal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    async updateReview() {
        try {
            const reviewId = document.getElementById('edit-review-id').value;
            const review = this.reviews.find(r => r.id === reviewId);
            if (!review) return;

            const formData = new FormData(document.getElementById('edit-review-form'));
            const profilePictureFile = document.getElementById('edit-profile-picture').files[0];
            const reviewImagesFiles = Array.from(document.getElementById('edit-review-images').files);

            // Validate required fields
            const reviewerName = formData.get('editReviewerName').trim();
            const reviewerLocation = formData.get('editReviewerLocation').trim();
            const reviewText = formData.get('editReviewText').trim();
            const rating = parseInt(formData.get('editRating')) || 0;
            
            if (!reviewerName || !reviewerLocation || !reviewText) {
                this.showNotification('Please fill in all required fields (Name, Location, and Review)', 'error');
                return;
            }
            
            if (rating === 0) {
                this.showNotification('Please select a rating for your experience', 'error');
                return;
            }

            // Update review data
            review.reviewerName = reviewerName;
            review.reviewerLocation = reviewerLocation;
            review.reviewText = reviewText;
            review.rating = rating;
            review.updatedAt = new Date().toISOString();

            // Update profile picture if new one is selected
            if (profilePictureFile) {
                review.profilePicture = await this.fileToBase64(profilePictureFile);
            }

            // Update review images if new ones are selected
            if (reviewImagesFiles.length > 0) {
                review.reviewImages = await Promise.all(reviewImagesFiles.map(file => this.fileToBase64(file)));
            }

            this.saveReviews();
            this.renderReviews();
            this.closeEditModal();
            this.showNotification('Review updated successfully!', 'success');
        } catch (error) {
            console.error('Error updating review:', error);
            this.showNotification('Error updating review. Please try again.', 'error');
        }
    }

    // DELETE - Remove review
    deleteReview(reviewId) {
        if (confirm('Are you sure you want to delete this review?')) {
            this.reviews = this.reviews.filter(r => r.id !== reviewId);
            this.saveReviews();
            this.renderReviews();
            this.showNotification('Review deleted successfully!', 'success');
        }
    }

    // Utility functions
    previewImage(event, imgId, containerId) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById(imgId).src = e.target.result;
                document.getElementById(containerId).style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }

    fileToBase64(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    }

    async fileToBase64(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    }

    getDefaultAvatar() {
        // Generate a colorful avatar based on name
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        return `data:image/svg+xml;base64,${btoa(`
            <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
                <circle cx="25" cy="25" r="25" fill="${randomColor}"/>
                <text x="25" y="30" text-anchor="middle" fill="white" font-family="Arial" font-size="20" font-weight="bold">👤</text>
            </svg>
        `)}`;
    }

    resetForm() {
        document.getElementById('review-form').reset();
        document.getElementById('image-preview').style.display = 'none';
        document.getElementById('review-images-preview').style.display = 'none';
        document.getElementById('review-images-preview').innerHTML = '';
        
        // Reset rating
        this.setRating(0, '.star-rating', document.getElementById('rating-text'));
    }

    closeEditModal() {
        document.getElementById('edit-modal').classList.add('hidden');
        document.body.style.overflow = 'auto';
        this.currentEditId = null;
        document.getElementById('edit-review-form').reset();
        document.getElementById('edit-image-preview').style.display = 'none';
        document.getElementById('edit-review-images-preview').innerHTML = '';
        
        // Reset rating
        this.setRating(0, '.edit-star-rating', document.getElementById('edit-rating-text'));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full max-w-sm`;
        
        if (type === 'success') {
            notification.className += ' bg-green-500 text-white';
        } else if (type === 'error') {
            notification.className += ' bg-red-500 text-white';
        } else {
            notification.className += ' bg-blue-500 text-white';
        }

        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Remove after 4 seconds for error messages
        const duration = type === 'error' ? 4000 : 3000;
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    // Local Storage functions
    saveReviews() {
        localStorage.setItem('goJapanReviews', JSON.stringify(this.reviews));
    }

    loadReviews() {
        const saved = localStorage.getItem('goJapanReviews');
        return saved ? JSON.parse(saved) : [];
    }

    // Add sample reviews for demonstration
    addSampleReviews() {
        if (this.reviews.length === 0) {
            const sampleReviews = [
                {
                    id: 'sample1',
                    reviewerName: 'Olivia Richardson',
                    reviewerLocation: 'New York, USA',
                    reviewText: 'I\'ve tried countless travel guides, but nothing compares to the depth and beauty of Go Japan. Every recommendation feels like discovering a hidden gem! My trip to Japan was absolutely magical.',
                    rating: 5,
                    profilePicture: this.getDefaultAvatar(),
                    reviewImages: [],
                    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
                    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
                },
                {
                    id: 'sample2',
                    reviewerName: 'Sophia Mitchell',
                    reviewerLocation: 'London, UK',
                    reviewText: 'As a Japan enthusiast, I appreciate the authentic insights and cultural context provided. The seasonal guides helped me plan the perfect cherry blossom trip!',
                    rating: 4,
                    profilePicture: this.getDefaultAvatar(),
                    reviewImages: [],
                    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
                    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString()
                },
                {
                    id: 'sample3',
                    reviewerName: 'Aisha Khan',
                    reviewerLocation: 'Mumbai, India',
                    reviewText: 'The food recommendations are incredible! I discovered so many local delicacies I never would have found on my own. Go Japan made my culinary journey unforgettable.',
                    rating: 5,
                    profilePicture: this.getDefaultAvatar(),
                    reviewImages: [],
                    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
                    updatedAt: new Date(Date.now() - 86400000 * 7).toISOString()
                }
            ];

            this.reviews = sampleReviews;
            this.saveReviews();
            this.renderReviews();
        }
    }

    // Preview multiple review images
    previewReviewImages(event, containerId) {
        const files = Array.from(event.target.files);
        const container = document.getElementById(containerId);
        
        if (files.length === 0) {
            container.style.display = 'none';
            container.innerHTML = '';
            return;
        }

        container.style.display = 'block';
        container.innerHTML = '';

        files.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewItem = document.createElement('div');
                previewItem.className = 'image-preview-item';
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="Preview ${index + 1}">
                    <button type="button" class="remove-preview" onclick="reviewsManager.removePreviewImage(this, '${containerId}')">×</button>
                `;
                container.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        });
    }

    // Remove preview image
    removePreviewImage(button, containerId) {
        const previewItem = button.parentElement;
        previewItem.remove();
        
        const container = document.getElementById(containerId);
        if (container.children.length === 0) {
            container.style.display = 'none';
        }
    }

    // Display current review images in edit modal
    displayCurrentReviewImages(images) {
        const container = document.getElementById('edit-review-images-preview');
        
        if (images.length === 0) {
            container.style.display = 'none';
            container.innerHTML = '';
            return;
        }

        container.style.display = 'block';
        container.innerHTML = '';

        images.forEach((image, index) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'image-preview-item';
            previewItem.innerHTML = `
                <img src="${image}" alt="Current image ${index + 1}">
                <button type="button" class="remove-preview" onclick="reviewsManager.removeCurrentImage(this, ${index})">×</button>
            `;
            container.appendChild(previewItem);
        });
    }

    // Remove current image from edit
    removeCurrentImage(button, index) {
        const review = this.reviews.find(r => r.id === this.currentEditId);
        if (review && review.reviewImages) {
            review.reviewImages.splice(index, 1);
            this.displayCurrentReviewImages(review.reviewImages);
        }
    }

    // Open image modal for full view
    openImageModal(imageSrc) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <img src="${imageSrc}" alt="Full size image">
            <span class="close-modal">&times;</span>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Close modal events
        modal.querySelector('.close-modal').addEventListener('click', () => {
            this.closeImageModal();
        });
    }

    // Close image modal
    closeImageModal() {
        const modal = document.querySelector('.image-modal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    }

    // Star Rating Methods
    initializeStarRating() {
        const stars = document.querySelectorAll('.star-rating label');
        const ratingText = document.getElementById('rating-text');
        
        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                const rating = parseInt(e.target.dataset.value);
                this.setRating(rating, '.star-rating', ratingText);
            });
            
            star.addEventListener('mouseenter', (e) => {
                const rating = parseInt(e.target.dataset.value);
                this.highlightStars(rating, '.star-rating');
                this.updateRatingText(rating, ratingText);
            });
        });
        
        const starContainer = document.querySelector('.star-rating');
        starContainer.addEventListener('mouseleave', () => {
            const currentRating = parseInt(starContainer.dataset.rating);
            this.highlightStars(currentRating, '.star-rating');
            this.updateRatingText(currentRating, ratingText);
        });
    }

    initializeEditStarRating() {
        const stars = document.querySelectorAll('.edit-star-rating label');
        const ratingText = document.getElementById('edit-rating-text');
        
        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                const rating = parseInt(e.target.dataset.value);
                this.setRating(rating, '.edit-star-rating', ratingText);
            });
            
            star.addEventListener('mouseenter', (e) => {
                const rating = parseInt(e.target.dataset.value);
                this.highlightStars(rating, '.edit-star-rating');
                this.updateRatingText(rating, ratingText);
            });
        });
        
        const starContainer = document.querySelector('.edit-star-rating');
        starContainer.addEventListener('mouseleave', () => {
            const currentRating = parseInt(starContainer.dataset.rating);
            this.highlightStars(currentRating, '.edit-star-rating');
            this.updateRatingText(currentRating, ratingText);
        });
    }

    setRating(rating, containerSelector, textElement) {
        const container = document.querySelector(containerSelector);
        container.dataset.rating = rating;
        
        // Set radio button
        const radio = document.querySelector(`${containerSelector} input[value="${rating}"]`);
        if (radio) radio.checked = true;
        
        this.highlightStars(rating, containerSelector);
        this.updateRatingText(rating, textElement);
    }

    highlightStars(rating, containerSelector) {
        const stars = document.querySelectorAll(`${containerSelector} label`);
        stars.forEach((star, index) => {
            if (index < rating) {
                star.style.color = '#f59e0b';
            } else {
                star.style.color = '#d1d5db';
            }
        });
    }

    updateRatingText(rating, textElement) {
        if (!textElement) return;
        
        const ratingTexts = {
            0: 'Click to rate',
            1: 'Terrible',
            2: 'Poor',
            3: 'Average',
            4: 'Good',
            5: 'Excellent'
        };
        
        textElement.textContent = ratingTexts[rating] || 'Click to rate';
        textElement.className = `ml-3 text-sm rating-feedback ${this.getRatingClass(rating)}`;
    }

    getRatingClass(rating) {
        const classes = {
            0: '',
            1: 'terrible',
            2: 'poor',
            3: 'average',
            4: 'good',
            5: 'excellent'
        };
        return classes[rating] || '';
    }

    createRatingHtml(rating) {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? '★' : '☆');
        }
        
        const ratingTexts = {
            0: 'Not rated',
            1: 'Terrible',
            2: 'Poor',
            3: 'Average',
            4: 'Good',
            5: 'Excellent'
        };
        
        return `
            <div class="review-rating">
                <div class="stars">
                    ${stars.map(star => `<span class="star">${star}</span>`).join('')}
                </div>
                <span class="rating-text">${ratingTexts[rating] || 'Not rated'}</span>
            </div>
        `;
    }
}

// Initialize the reviews manager when the page loads
let reviewsManager;
document.addEventListener('DOMContentLoaded', () => {
    reviewsManager = new ReviewsManager();
});

// Export for global access
window.reviewsManager = reviewsManager;
