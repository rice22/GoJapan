import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SeasonsSection = () => {
  const [activeSeason, setActiveSeason] = useState('spring');
  const [openDoors, setOpenDoors] = useState(new Set());

  const seasons = [
    {
      id: 'spring',
      name: 'Spring',
      description: 'Cherry blossoms bloom across Japan, creating magical pink landscapes',
      images: ['/assets/seasons/spring1.jpg', '/assets/seasons/spring2.jpg'],
      effects: ['sakura-petals'],
      months: ['March', 'April', 'May'],
    },
    {
      id: 'summer',
      name: 'Summer',
      description: 'Festivals, fireworks, and lush green landscapes define Japanese summers',
      images: ['/assets/seasons/summer1.jpg', '/assets/seasons/summer2.jpg'],
      effects: ['fireflies'],
      months: ['June', 'July', 'August'],
    },
    {
      id: 'autumn',
      name: 'Autumn',
      description: 'Brilliant red and gold foliage transforms Japan into a colorful wonderland',
      images: ['/assets/seasons/autumn1.jpg', '/assets/seasons/autumn2.jpg'],
      effects: ['falling-leaves'],
      months: ['September', 'October', 'November'],
    },
    {
      id: 'winter',
      name: 'Winter',
      description: 'Snow-covered temples and hot springs create serene winter beauty',
      images: ['/assets/seasons/winter1.jpg', '/assets/seasons/winter2.jpg'],
      effects: ['snowflakes'],
      months: ['December', 'January', 'February'],
    },
  ];

  const currentSeason = seasons.find(s => s.id === activeSeason) || seasons[0];

  useEffect(() => {
    // Auto-cycle code or any other effects can be added here
  }, [activeSeason]);

  const handleDoorClick = (doorIndex) => {
    const newOpenDoors = new Set(openDoors);
    if (newOpenDoors.has(doorIndex)) {
      newOpenDoors.delete(doorIndex);
    } else {
      newOpenDoors.add(doorIndex);
    }
    setOpenDoors(newOpenDoors);
  };

  const renderSeasonEffect = (effect) => {
    switch (effect) {
      case 'sakura-petals':
        return [...Array(20)].map((_, i) => <div key={i} className="sakura-petal" />);
      case 'fireflies':
        return [...Array(15)].map((_, i) => <div key={i} className="firefly" />);
      case 'falling-leaves':
        return [...Array(15)].map((_, i) => <div key={i} className="falling-leaf" />);
      case 'snowflakes':
        return [...Array(30)].map((_, i) => <div key={i} className="snowflake" />);
      default:
        return null;
    }
  };

  return (
    <section className="seasons-section">
      {/* Left Panel */}
      <div className="season-info">
        <h2>{currentSeason.name}</h2>
        <p>{currentSeason.description}</p>
        <div className="season-buttons">
          {seasons.map((season) => (
            <motion.button
              key={season.id}
              onClick={() => setActiveSeason(season.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: seasons.indexOf(season) * 0.1 }}
              className={season.id === activeSeason ? 'active' : ''}
            >
              {season.id === 'spring' && '🌸'}
              {season.id === 'summer' && '☀️'}
              {season.id === 'autumn' && '🍂'}
              {season.id === 'winter' && '❄️'}
              {season.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Right Panel - Shoji Rooms */}
      <div className="seasons-rooms">
        {[0, 1, 2, 3].map((roomIndex) => (
          <div key={roomIndex} className="season-room">
            <motion.div
              className="shoji-door"
              onClick={() => handleDoorClick(roomIndex)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Door {roomIndex + 1}
            </motion.div>
            <div className="room-content">
              {openDoors.has(roomIndex) && (
                <>
                  <h3>{currentSeason.name}</h3>
                  <p>{currentSeason.months.join(', ')}</p>
                  <div className="season-effects">
                    {renderSeasonEffect(currentSeason.effects[0])}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SeasonsSection;
