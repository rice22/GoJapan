import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);

  const heroCards = [
    {
      id: '1',
      image: '/assets/hero/tokyo.jpg',
      region: 'Kanto Region',
      title: 'Tokyo\nMetropolis',
      description: "Experience the vibrant energy of Japan's capital city",
    },
    {
      id: '2',
      image: '/assets/hero/osaka.jpg',
      region: 'Kansai Region',
      title: 'Osaka\nCastle',
      description: 'Discover the culinary capital and historic landmarks',
    },
    {
      id: '3',
      image: '/assets/hero/kyoto.jpg',
      region: 'Kansai Region',
      title: 'Kyoto\nTemples',
      description: 'Step into ancient Japan with traditional temples and gardens',
    },
    {
      id: '4',
      image: '/assets/hero/hokkaido.jpg',
      region: 'Hokkaido',
      title: 'Hokkaido\nNature',
      description: 'Explore pristine wilderness and seasonal beauty',
    },
  ];

  const currentCard = heroCards[currentIndex];

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroCards.length);
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [heroCards.length]);

  const handleCardClick = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setCurrentIndex((prev) => (prev - 1 + heroCards.length) % heroCards.length);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setCurrentIndex((prev) => (prev + 1) % heroCards.length);
  };

  return (
    <section>
      <div className="background-image" style={{ backgroundImage: `url(${currentCard.image})` }} />
      <div className="left-content">
        <h2>{currentCard.region}</h2>
        <h1>
          {currentCard.title.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < currentCard.title.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </h1>
        <p>{currentCard.description}</p>
      </div>
      <div className="carousel">
        {heroCards.map((card, index) => (
          <motion.div
            key={card.id}
            onClick={() => handleCardClick(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`carousel-card ${index === currentIndex ? 'active' : ''}`}
          >
            <p>{card.title.split('\n')[0]}</p>
          </motion.div>
        ))}
      </div>
      <div className="navigation">
        <button onClick={handlePrev} disabled={isTransitioning}>Previous</button>
        <span>{currentIndex + 1} / {heroCards.length}</span>
        <button onClick={handleNext} disabled={isTransitioning}>Next</button>
      </div>
    </section>
  );
};

export default HeroSection;
