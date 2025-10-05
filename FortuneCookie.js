import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FortuneCookie = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [fortune, setFortune] = useState('');
  const [sparkles, setSparkles] = useState([]);

  const fortunes = [
    "Your journey to Japan will bring unexpected joy and beautiful memories.",
    "A new adventure awaits you in the land of the rising sun.",
    "The cherry blossoms will bloom especially beautifully for you this year.",
    "Your path will cross with someone who will change your perspective on life.",
    "The ancient temples hold wisdom that will guide your next steps.",
    "A hot spring experience will wash away all your worries.",
    "The taste of authentic ramen will awaken your soul.",
    "Mount Fuji's majesty will inspire greatness within you.",
    "The sound of temple bells will bring you inner peace.",
    "Your appreciation for Japanese culture will deepen with each visit."
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleCookieClick = () => {
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    setFortune(randomFortune);
    setShowModal(true);

    const newSparkles = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }));

    setSparkles(newSparkles);

    setTimeout(() => setSparkles([]), 2000);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className="fortune-cookie"
        onClick={handleCookieClick}
        style={{
          cursor: 'pointer',
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#FFC107',
          padding: '10px',
          borderRadius: '50%',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 1000,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        🥠
      </motion.div>
      {sparkles.map(sparkle => (
        <motion.div
          key={sparkle.id}
          className="sparkle"
          style={{
            position: 'fixed',
            left: sparkle.x,
            top: sparkle.y,
            width: '10px',
            height: '10px',
            backgroundColor: 'gold',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 1000,
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 0, y: -50 }}
          transition={{ duration: 1.5 }}
        />
      ))}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#FFF8E7',
              padding: '2rem',
              borderRadius: '3px',
              maxWidth: '300px',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24), inset 0 0 20px rgba(0,0,0,0.05)',
              fontFamily: 'Courier New, monospace',
              zIndex: 1001,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <p>{fortune}</p>
            <button onClick={handleCloseModal}>Close</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FortuneCookie;
