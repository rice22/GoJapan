import React from 'react';
import { useParams } from 'react-router-dom';

const SeasonPage = () => {
  const { season } = useParams();

  return (
    <div>
      <h1>This is a placeholder for the {season} season page.</h1>
      <p>You can implement the full season content here based on your existing HTML files.</p>
    </div>
  );
};

export default SeasonPage;
