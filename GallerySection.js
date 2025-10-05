import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GallerySection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const galleryImages = [
    {
      id: '1',
      src: '/assets/gallery/tokyo-shibuya.jpeg',
      alt: 'Shibuya Crossing',
      category: 'urban',
      title: 'Shibuya Crossing'
    },
    {
      id: '2',
      src: '/assets/gallery/osaka-dotonbori.jpeg',
      alt: 'Dotonbori District',
      category: 'urban',
      title: 'Dotonbori District'
    },
    {
      id: '3',
      src: '/assets/gallery/fushimi-inari.jpeg',
      alt: 'Fushimi Inari Shrine',
      category: 'temple',
      title: 'Fushimi Inari Shrine'
    },
    {
      id: '4',
      src: '/assets/gallery/hiroshima-itsukushima.jpeg',
      alt: 'Itsukushima Shrine',
      category: 'temple',
      title: 'Itsukushima Shrine'
    },
    {
      id: '5',
      src: '/assets/gallery/hokkaido-biei.jpeg',
      alt: 'Biei Hills',
      category: 'nature',
      title: 'Biei Hills'
    },
    {
      id: '6',
      src: '/assets/gallery/nikko-toshogu.jpeg',
      alt: 'Nikko Toshogu',
      category: 'temple',
      title: 'Nikko Toshogu'
    },
    {
      id: '7',
      src: '/assets/gallery/kanagawa-kamakura.jpg',
      alt: 'Kamakura Buddha',
      category: 'temple',
      title: 'Kamakura Buddha'
    },
    {
      id: '8',
      src: '/assets/gallery/gifu-shirakawa.jpg',
      alt: 'Shirakawa-go Village',
      category: 'traditional',
      title: 'Shirakawa-go Village'
    }
  ];

  const handleImageClick = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const handleNextImage = () => {
    const nextIndex = (currentImageIndex + 1) % galleryImages.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(galleryImages[nextIndex]);
  };

  const handlePrevImage = () => {
    const prevIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(galleryImages[prevIndex]);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const largeImages = galleryImages.slice(0, 2);
  const smallImages = galleryImages.slice(2);

  return (
    <section>
      <h2>Discover Japan</h2>
      <p>Explore the beauty and diversity of Japanese landscapes and culture</p>

      {/* Large Images Row */}
      <div>
        {largeImages.map((image, index) => (
          <motion.div 
            key={image.id} 
            onClick={() => handleImageClick(image, index)} 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <img src={image.src} alt={image.alt} />
            <p>{image.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Small Images Grid */}
      <div>
        {smallImages.map((image, index) => (
          <motion.div 
            key={image.id} 
            onClick={() => handleImageClick(image, index + 2)} 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: (index + 2) * 0.1 }}
          >
            <img src={image.src} alt={image.alt} />
            <p>{image.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="modal"
            onClick={handleCloseModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content" 
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3>{selectedImage.title}</h3>
              <img src={selectedImage.src} alt={selectedImage.alt} />
              <p>{selectedImage.alt}</p>
              <p>{currentImageIndex + 1} / {galleryImages.length}</p>
              <button onClick={handlePrevImage}>Previous</button>
              <button onClick={handleNextImage}>Next</button>
              <button onClick={handleCloseModal}>Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
