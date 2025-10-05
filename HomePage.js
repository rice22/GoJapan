import React from 'react';
import HeroSection from '../components/HeroSection';
import GallerySection from '../components/GallerySection';
import SeasonsSection from '../components/SeasonsSection';
import MapSection from '../components/MapSection';
import ReviewsSection from '../components/ReviewsSection';
import FortuneCookie from '../components/FortuneCookie';

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <GallerySection />
      <SeasonsSection />
      <MapSection />
      <ReviewsSection />
      <FortuneCookie />
    </>
  );
};

export default HomePage;
