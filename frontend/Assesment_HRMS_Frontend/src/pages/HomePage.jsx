import React from 'react';
import Header from '../componets/Header';
import Footer from '../componets/Footer';
import ImageCarousel from '../componets/ImageCarousel';
import FeedScroll from '../componets/FeedScroll';

import './css/HomePage.css';

const HomePage = () => {
  return (
    <div className="container">
      <Header />
      <main className="main-content">
        <ImageCarousel />
        <FeedScroll />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;