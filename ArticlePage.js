import React from 'react';
import { useParams } from 'react-router-dom';

const ArticlePage = () => {
  const { prefecture } = useParams();

  return (
    <div>
      <h1>This is a placeholder for the {prefecture} article page</h1>
      <p>You can implement the full article content here based on your existing HTML files.</p>
    </div>
  );
};

export default ArticlePage;
