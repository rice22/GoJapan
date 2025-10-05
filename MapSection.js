import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MapSection = () => {
  const [hoveredPrefecture, setHoveredPrefecture] = useState(null);
  const [selectedPrefecture, setSelectedPrefecture] = useState(null);

  // Sample prefecture data - can be moved to a separate data file
  const prefectures = [
    {
      id: 'tokyo',
      name: '東京都',
      nameEn: 'Tokyo',
      region: 'Kanto',
      image: '/assets/prefectures/tokyo.jpeg',
      description: "Japan's bustling capital city",
      weather: 'Mild winters, hot summers',
      coordinates: { x: 300, y: 200 },
    },
    {
      id: 'osaka',
      name: '大阪府',
      nameEn: 'Osaka',
      region: 'Kansai',
      image: '/assets/prefectures/osaka.jpeg',
      description: "Japan's kitchen and commercial center",
      weather: 'Warm climate year-round',
      coordinates: { x: 250, y: 350 },
    },
    {
      id: 'kyoto',
      name: '京都府',
      nameEn: 'Kyoto',
      region: 'Kansai',
      image: '/assets/prefectures/kyoto.jpeg',
      description: 'Ancient capital with traditional culture',
      weather: 'Four distinct seasons',
      coordinates: { x: 280, y: 320 },
    },
    {
      id: 'hokkaido',
      name: '北海道',
      nameEn: 'Hokkaido',
      region: 'Hokkaido',
      image: '/assets/prefectures/hokkaido.jpeg',
      description: 'Northern island with pristine nature',
      weather: 'Cool summers, snowy winters',
      coordinates: { x: 400, y: 50 },
    },
  ];

  const handlePrefectureHover = (prefecture) => {
    setHoveredPrefecture(prefecture);
  };

  const handlePrefectureClick = (prefecture) => {
    setSelectedPrefecture(prefecture);
  };

  const handlePrefectureLeave = () => {
    setHoveredPrefecture(null);
  };

  return (
    <section>
      <h2>Explore Japan by Prefecture</h2>
      <p>Click on any prefecture to learn more about its unique attractions</p>

      {/* Simplified map representation for demonstration */}
      <svg width="600" height="400" style={{ border: '1px solid #ccc' }}>
        {prefectures.map((pref) => (
          <circle
            key={pref.id}
            cx={pref.coordinates.x}
            cy={pref.coordinates.y}
            r="20"
            fill={hoveredPrefecture?.id === pref.id ? 'orange' : 'gray'}
            onMouseEnter={() => handlePrefectureHover(pref)}
            onMouseLeave={handlePrefectureLeave}
            onClick={() => handlePrefectureClick(pref)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </svg>

      {/* Hover info */}
      {hoveredPrefecture && (
        <div className="hover-info">
          <h3>{hoveredPrefecture.nameEn}</h3>
          <p>🌡️ {hoveredPrefecture.weather}</p>
        </div>
      )}

      {/* Modal for selected prefecture */}
      <AnimatePresence>
        {selectedPrefecture && (
          <motion.div
            className="modal"
            onClick={() => setSelectedPrefecture(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <motion.div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '5px',
                maxWidth: '400px',
              }}
            >
              <h2>{selectedPrefecture.nameEn}</h2>
              <img
                src={selectedPrefecture.image}
                alt={selectedPrefecture.nameEn}
                style={{ width: '100%', borderRadius: '5px' }}
              />
              <p>{selectedPrefecture.name}</p>
              <p>{selectedPrefecture.description}</p>
              <p>🌡️ {selectedPrefecture.weather}</p>
              <p>{selectedPrefecture.region} Region</p>
              <button
                onClick={() => {
                  window.location.href = `/article/${selectedPrefecture.id}`;
                }}
              >
                Read More
              </button>
              <button onClick={() => setSelectedPrefecture(null)}>Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MapSection;
