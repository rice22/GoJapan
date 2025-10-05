// Enhanced Reviews Management System with Database Integration
class ReviewsManager {
    constructor() {
        this.reviews = [];
        this.currentEditId = null;
        this.databaseManager = new DatabaseManager();
        this.isOnline = navigator.onLine;
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadReviewsFromDatabase();
        this.addSampleReviewsIfEmpty();
        this.setupOfflineSupport();
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

        // Online/offline status monitoring
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showNotification('You are offline. Reviews will be saved locally and synced when online.', 'info');
        });
    }

    // CREATE - Add new review to database
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
            
            // Show loading state
            this.setLoadingState(true);
            
            // Convert images to base64
            const profilePicture = profilePictureFile ? await this.fileToBase64(profilePictureFile) : this.getDefaultAvatar();
            const reviewImages = reviewImagesFiles.length > 0 ? await Promise.all(reviewImagesFiles.map(file => this.fileToBase64(file))) : [];
            
            const reviewData = {
                reviewerName: reviewerName,
                reviewerLocation: reviewerLocation,
                reviewText: reviewText,
                profilePicture: profilePicture,
                reviewImages: reviewImages
            };

            let result;
            if (this.isOnline) {
                // Save to database
                result = await this.databaseManager.createReview(reviewData);
            } else {
                // Save locally for later sync
                result = await this.saveReviewLocally(reviewData);
            }

            if (result.success) {
                this.resetForm();
                await this.loadReviewsFromDatabase();
                this.showNotification(result.message, 'success');
            } else {
                this.showNotification(result.message, 'error');
            }
        } catch (error) {
            console.error('Error creating review:', error);
            this.showNotification('Error creating review. Please try again.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    // READ - Load reviews from database
    async loadReviewsFromDatabase() {
        try {
            if (this.isOnline) {
                const result = await this.databaseManager.getAllReviews();
                if (result.success) {
                    this.reviews = result.data;
                    this.renderReviews();
                } else {
                    // Fallback to local storage
                    this.loadReviewsFromLocalStorage();
                }
            } else {
                this.loadReviewsFromLocalStorage();
            }
        } catch (error) {
            console.error('Error loading reviews:', error);
            this.loadReviewsFromLocalStorage();
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

        card.innerHTML = `
            <div class="review-actions">
                <button class="edit-btn" onclick="reviewsManager.editReview('${review.id}')" title="Edit Review">
                    ✏️
                </button>
                <button class="delete-btn" onclick="reviewsManager.deleteReview('${review.id}')" title="Delete Review">
                    🗑️
                </button>
            </div>
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
    async editReview(reviewId) {
        const review = this.reviews.find(r => r.id === reviewId);
        if (!review) return;

        this.currentEditId = reviewId;
        
        // Populate edit form
        document.getElementById('edit-review-id').value = reviewId;
        document.getElementById('edit-reviewer-name').value = review.reviewerName;
        document.getElementById('edit-reviewer-location').value = review.reviewerLocation;
        document.getElementById('edit-review-text').value = review.reviewText;
        
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
            
            if (!reviewerName || !reviewerLocation || !reviewText) {
                this.showNotification('Please fill in all required fields (Name, Location, and Review)', 'error');
                return;
            }

            this.setLoadingState(true);

            const reviewData = {
                reviewerName: reviewerName,
                reviewerLocation: reviewerLocation,
                reviewText: reviewText,
                profilePicture: review.profilePicture, // Keep existing if no new one
                reviewImages: review.reviewImages || [] // Keep existing if no new ones
            };

            // Handle new profile picture
            if (profilePictureFile) {
                reviewData.newProfilePicture = await this.fileToBase64(profilePictureFile);
            }

            // Handle new review images
            if (reviewImagesFiles.length > 0) {
                reviewData.newReviewImages = await Promise.all(reviewImagesFiles.map(file => this.fileToBase64(file)));
            }

            let result;
            if (this.isOnline) {
                result = await this.databaseManager.updateReview(reviewId, reviewData);
            } else {
                result = await this.updateReviewLocally(reviewId, reviewData);
            }

            if (result.success) {
                this.closeEditModal();
                await this.loadReviewsFromDatabase();
                this.showNotification(result.message, 'success');
            } else {
                this.showNotification(result.message, 'error');
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
                
                let result;
                if (this.isOnline) {
                    result = await this.databaseManager.deleteReview(reviewId);
                } else {
                    result = await this.deleteReviewLocally(reviewId);
                }

                if (result.success) {
                    await this.loadReviewsFromDatabase();
                    this.showNotification(result.message, 'success');
                } else {
                    this.showNotification(result.message, 'error');
                }
            } catch (error) {
                console.error('Error deleting review:', error);
                this.showNotification('Error deleting review. Please try again.', 'error');
            } finally {
                this.setLoadingState(false);
            }
        }
    }

    // Offline Support Methods
    async saveReviewLocally(reviewData) {
        const review = {
            id: Date.now().toString(),
            ...reviewData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isOffline: true
        };

        this.reviews.unshift(review);
        this.saveReviewsToLocalStorage();
        return { success: true, message: 'Review saved locally. Will sync when online.' };
    }

    async updateReviewLocally(reviewId, reviewData) {
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
            Object.assign(review, reviewData);
            review.updatedAt = new Date().toISOString();
            review.isOffline = true;
            this.saveReviewsToLocalStorage();
            return { success: true, message: 'Review updated locally. Will sync when online.' };
        }
        return { success: false, message: 'Review not found.' };
    }

    async deleteReviewLocally(reviewId) {
        this.reviews = this.reviews.filter(r => r.id !== reviewId);
        this.saveReviewsToLocalStorage();
        return { success: true, message: 'Review deleted locally.' };
    }

    async syncOfflineData() {
        const offlineReviews = this.reviews.filter(r => r.isOffline);
        for (const review of offlineReviews) {
            try {
                await this.databaseManager.createReview(review);
                review.isOffline = false;
            } catch (error) {
                console.error('Error syncing review:', error);
            }
        }
        this.saveReviewsToLocalStorage();
        this.showNotification('Offline reviews synced successfully!', 'success');
    }

    // Local Storage Methods (Fallback)
    loadReviewsFromLocalStorage() {
        const saved = localStorage.getItem('goJapanReviews');
        this.reviews = saved ? JSON.parse(saved) : [];
        this.renderReviews();
    }

    saveReviewsToLocalStorage() {
        localStorage.setItem('goJapanReviews', JSON.stringify(this.reviews));
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
        const review = this.reviews.find(r => r.id === this.currentEditId);
        if (review && review.reviewImages) {
            review.reviewImages.splice(index, 1);
            this.displayCurrentReviewImages(review.reviewImages);
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

    async fileToBase64(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
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

    setupOfflineSupport() {
        // Add offline indicator
        const offlineIndicator = document.createElement('div');
        offlineIndicator.id = 'offline-indicator';
        offlineIndicator.className = 'fixed bottom-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg hidden z-50';
        offlineIndicator.textContent = 'You are offline';
        document.body.appendChild(offlineIndicator);

        // Show/hide offline indicator
        const updateOfflineIndicator = () => {
            const indicator = document.getElementById('offline-indicator');
            if (this.isOnline) {
                indicator.classList.add('hidden');
            } else {
                indicator.classList.remove('hidden');
            }
        };

        window.addEventListener('online', updateOfflineIndicator);
        window.addEventListener('offline', updateOfflineIndicator);
    }

    addSampleReviewsIfEmpty() {
        if (this.reviews.length === 0) {
            const sampleReviews = [
                {
                    id: 'sample1',
                    reviewerName: 'Olivia Richardson',
                    reviewerLocation: 'New York, USA',
                    reviewText: 'I\'ve tried countless travel guides, but nothing compares to the depth and beauty of Go Japan. Every recommendation feels like discovering a hidden gem! My trip to Japan was absolutely magical.',
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
                    profilePicture: this.getDefaultAvatar(),
                    reviewImages: [],
                    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
                    updatedAt: new Date(Date.now() - 86400000 * 7).toISOString()
                }
            ];

            this.reviews = sampleReviews;
            this.saveReviewsToLocalStorage();
            this.renderReviews();
        }
    }
}

// Initialize the reviews manager when the page loads
let reviewsManager;
document.addEventListener('DOMContentLoaded', () => {
    reviewsManager = new ReviewsManager();
});

// Export for global access
window.reviewsManager = reviewsManager;

