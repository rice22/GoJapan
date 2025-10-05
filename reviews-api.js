// API-Based Reviews Manager (for custom backend)
class APIReviewsManager {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000/api'; // Change this to your backend URL
        this.reviews = [];
        this.currentEditId = null;
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadReviews();
        this.addSampleReviewsIfEmpty();
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

        // Image preview events
        document.getElementById('profile-picture').addEventListener('change', (e) => {
            this.previewImage(e, 'preview-img', 'image-preview');
        });

        document.getElementById('edit-profile-picture').addEventListener('change', (e) => {
            this.previewImage(e, 'edit-preview-img', 'edit-image-preview');
        });

        document.getElementById('review-images').addEventListener('change', (e) => {
            this.previewReviewImages(e, 'review-images-preview');
        });

        document.getElementById('edit-review-images').addEventListener('change', (e) => {
            this.previewReviewImages(e, 'edit-review-images-preview');
        });

        // Close modal events
        document.getElementById('edit-modal').addEventListener('click', (e) => {
            if (e.target.id === 'edit-modal') {
                this.closeEditModal();
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('image-modal')) {
                this.closeImageModal();
            }
        });
    }

    // API Helper Methods
    async apiCall(endpoint, method = 'GET', data = null) {
        try {
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            if (data) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(`${this.apiBaseUrl}${endpoint}`, options);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'API call failed');
            }

            return result;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async uploadImages(formData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Image upload failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Upload Error:', error);
            throw error;
        }
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
            
            if (!reviewerName || !reviewerLocation || !reviewText) {
                this.showNotification('Please fill in all required fields (Name, Location, and Review)', 'error');
                return;
            }
            
            this.setLoadingState(true);

            // Prepare form data for API
            const apiFormData = new FormData();
            apiFormData.append('reviewerName', reviewerName);
            apiFormData.append('reviewerLocation', reviewerLocation);
            apiFormData.append('reviewText', reviewText);

            // Add images if provided
            if (profilePictureFile) {
                apiFormData.append('images', profilePictureFile);
            }
            reviewImagesFiles.forEach(file => {
                apiFormData.append('images', file);
            });

            // Send to API
            const result = await this.uploadImages(apiFormData);

            if (result.success) {
                this.resetForm();
                await this.loadReviews();
                this.showNotification('Review added successfully!', 'success');
            } else {
                this.showNotification(result.message || 'Error creating review', 'error');
            }
        } catch (error) {
            console.error('Error creating review:', error);
            this.showNotification('Error creating review. Please try again.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    // READ - Load reviews from API
    async loadReviews() {
        try {
            const result = await this.apiCall('/reviews');
            if (result.success) {
                this.reviews = result.data;
                this.renderReviews();
            } else {
                this.showNotification('Error loading reviews', 'error');
            }
        } catch (error) {
            console.error('Error loading reviews:', error);
            this.showNotification('Error loading reviews', 'error');
        }
    }

    // Render all reviews
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

        // Parse review images if it's a JSON string
        let reviewImages = [];
        if (review.review_images) {
            try {
                reviewImages = typeof review.review_images === 'string' 
                    ? JSON.parse(review.review_images) 
                    : review.review_images;
            } catch (e) {
                reviewImages = [];
            }
        }

        // Create review images HTML if images exist
        let reviewImagesHtml = '';
        if (reviewImages && reviewImages.length > 0) {
            reviewImagesHtml = `
                <div class="review-images">
                    ${reviewImages.map((image, imgIndex) => `
                        <div class="review-image-preview">
                            <img src="${image}" alt="Review image ${imgIndex + 1}" class="review-image" 
                                 onclick="reviewsManager.openImageModal('${image}')">
                        </div>
                    `).join('')}
                </div>
            `;
        }

        card.innerHTML = `
            <div class="review-actions">
                <button class="edit-btn" onclick="reviewsManager.editReview('${review.id}')" title="Edit Review">
                    ✏️
                </button>
                <button class="delete-btn" onclick="reviewsManager.deleteReview('${review.id}')" title="Delete Review">
                    🗑️
                </button>
            </div>
            <div class="review-text">${this.escapeHtml(review.review_text)}</div>
            ${reviewImagesHtml}
            <div class="reviewer-info">
                <img src="${review.profile_picture || this.getDefaultAvatar()}" alt="${review.reviewer_name}" class="reviewer-avatar">
                <div class="reviewer-details">
                    <h4>${this.escapeHtml(review.reviewer_name)}</h4>
                    <p>${this.escapeHtml(review.reviewer_location)}</p>
                </div>
            </div>
        `;

        return card;
    }

    // UPDATE - Edit existing review
    async editReview(reviewId) {
        const review = this.reviews.find(r => r.id == reviewId);
        if (!review) return;

        this.currentEditId = reviewId;
        
        // Populate edit form
        document.getElementById('edit-review-id').value = reviewId;
        document.getElementById('edit-reviewer-name').value = review.reviewer_name;
        document.getElementById('edit-reviewer-location').value = review.reviewer_location;
        document.getElementById('edit-review-text').value = review.review_text;
        
        // Set current profile picture
        const editPreviewImg = document.getElementById('edit-preview-img');
        editPreviewImg.src = review.profile_picture || this.getDefaultAvatar();
        document.getElementById('edit-image-preview').style.display = 'block';

        // Display current review images
        let reviewImages = [];
        if (review.review_images) {
            try {
                reviewImages = typeof review.review_images === 'string' 
                    ? JSON.parse(review.review_images) 
                    : review.review_images;
            } catch (e) {
                reviewImages = [];
            }
        }
        this.displayCurrentReviewImages(reviewImages);

        // Show modal
        document.getElementById('edit-modal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    async updateReview() {
        try {
            const reviewId = document.getElementById('edit-review-id').value;
            const formData = new FormData(document.getElementById('edit-review-form'));
            const profilePictureFile = document.getElementById('edit-profile-picture').files[0];
            const reviewImagesFiles = Array.from(document.getElementById('edit-review-images').files);

            // Validate required fields
            const reviewerName = formData.get('editReviewerName').trim();
            const reviewerLocation = formData.get('editReviewerLocation').trim();
            const reviewText = formData.get('editReviewText').trim();
            
            if (!reviewerName || !reviewerLocation || !reviewText) {
                this.showNotification('Please fill in all required fields (Name, Location, and Review)', 'error');
                return;
            }

            this.setLoadingState(true);

            // Prepare update data
            const updateData = {
                reviewerName: reviewerName,
                reviewerLocation: reviewerLocation,
                reviewText: reviewText
            };

            // Handle image uploads if new images are provided
            if (profilePictureFile || reviewImagesFiles.length > 0) {
                const apiFormData = new FormData();
                apiFormData.append('reviewerName', reviewerName);
                apiFormData.append('reviewerLocation', reviewerLocation);
                apiFormData.append('reviewText', reviewText);

                if (profilePictureFile) {
                    apiFormData.append('images', profilePictureFile);
                }
                reviewImagesFiles.forEach(file => {
                    apiFormData.append('images', file);
                });

                // Upload images and update
                const uploadResult = await this.uploadImages(apiFormData);
                if (uploadResult.success) {
                    updateData.profilePicture = uploadResult.profilePicture;
                    updateData.reviewImages = uploadResult.reviewImages;
                }
            }

            const result = await this.apiCall(`/reviews/${reviewId}`, 'PUT', updateData);

            if (result.success) {
                this.closeEditModal();
                await this.loadReviews();
                this.showNotification('Review updated successfully!', 'success');
            } else {
                this.showNotification(result.message || 'Error updating review', 'error');
            }
        } catch (error) {
            console.error('Error updating review:', error);
            this.showNotification('Error updating review. Please try again.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    // DELETE - Remove review
    async deleteReview(reviewId) {
        if (confirm('Are you sure you want to delete this review?')) {
            try {
                this.setLoadingState(true);
                
                const result = await this.apiCall(`/reviews/${reviewId}`, 'DELETE');

                if (result.success) {
                    await this.loadReviews();
                    this.showNotification('Review deleted successfully!', 'success');
                } else {
                    this.showNotification(result.message || 'Error deleting review', 'error');
                }
            } catch (error) {
                console.error('Error deleting review:', error);
                this.showNotification('Error deleting review. Please try again.', 'error');
            } finally {
                this.setLoadingState(false);
            }
        }
    }

    // Utility Methods (same as before)
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

    removePreviewImage(button, containerId) {
        const previewItem = button.parentElement;
        previewItem.remove();
        
        const container = document.getElementById(containerId);
        if (container.children.length === 0) {
            container.style.display = 'none';
        }
    }

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

    removeCurrentImage(button, index) {
        const review = this.reviews.find(r => r.id == this.currentEditId);
        if (review && review.review_images) {
            let reviewImages = [];
            try {
                reviewImages = typeof review.review_images === 'string' 
                    ? JSON.parse(review.review_images) 
                    : review.review_images;
            } catch (e) {
                reviewImages = [];
            }
            reviewImages.splice(index, 1);
            review.review_images = JSON.stringify(reviewImages);
            this.displayCurrentReviewImages(reviewImages);
        }
    }

    openImageModal(imageSrc) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <img src="${imageSrc}" alt="Full size image">
            <span class="close-modal">&times;</span>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        modal.querySelector('.close-modal').addEventListener('click', () => {
            this.closeImageModal();
        });
    }

    closeImageModal() {
        const modal = document.querySelector('.image-modal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    }

    getDefaultAvatar() {
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
    }

    closeEditModal() {
        document.getElementById('edit-modal').classList.add('hidden');
        document.body.style.overflow = 'auto';
        this.currentEditId = null;
        document.getElementById('edit-review-form').reset();
        document.getElementById('edit-image-preview').style.display = 'none';
        document.getElementById('edit-review-images-preview').innerHTML = '';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setLoadingState(isLoading) {
        const submitBtn = document.getElementById('submit-review');
        const updateBtn = document.getElementById('update-review');
        
        if (isLoading) {
            if (submitBtn) submitBtn.disabled = true;
            if (updateBtn) updateBtn.disabled = true;
        } else {
            if (submitBtn) submitBtn.disabled = false;
            if (updateBtn) updateBtn.disabled = false;
        }
    }

    showNotification(message, type = 'info') {
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

        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

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

    addSampleReviewsIfEmpty() {
        if (this.reviews.length === 0) {
            const sampleReviews = [
                {
                    id: 'sample1',
                    reviewer_name: 'Olivia Richardson',
                    reviewer_location: 'New York, USA',
                    review_text: 'I\'ve tried countless travel guides, but nothing compares to the depth and beauty of Go Japan. Every recommendation feels like discovering a hidden gem! My trip to Japan was absolutely magical.',
                    profile_picture: this.getDefaultAvatar(),
                    review_images: '[]',
                    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
                    updated_at: new Date(Date.now() - 86400000 * 2).toISOString()
                },
                {
                    id: 'sample2',
                    reviewer_name: 'Sophia Mitchell',
                    reviewer_location: 'London, UK',
                    review_text: 'As a Japan enthusiast, I appreciate the authentic insights and cultural context provided. The seasonal guides helped me plan the perfect cherry blossom trip!',
                    profile_picture: this.getDefaultAvatar(),
                    review_images: '[]',
                    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
                    updated_at: new Date(Date.now() - 86400000 * 5).toISOString()
                },
                {
                    id: 'sample3',
                    reviewer_name: 'Aisha Khan',
                    reviewer_location: 'Mumbai, India',
                    review_text: 'The food recommendations are incredible! I discovered so many local delicacies I never would have found on my own. Go Japan made my culinary journey unforgettable.',
                    profile_picture: this.getDefaultAvatar(),
                    review_images: '[]',
                    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
                    updated_at: new Date(Date.now() - 86400000 * 7).toISOString()
                }
            ];

            this.reviews = sampleReviews;
            this.renderReviews();
        }
    }
}

// Initialize the reviews manager when the page loads
let reviewsManager;
document.addEventListener('DOMContentLoaded', () => {
    reviewsManager = new APIReviewsManager();
});

// Export for global access
window.reviewsManager = reviewsManager;

