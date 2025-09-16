import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Loading = () => {
  return (
    <div style={{ padding: '1rem' }}>
      {Array(6).fill(0).map((_, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <Skeleton circle height={100} width={100} />
          <Skeleton height={20} count={2} style={{ marginTop: '10px' }} />
        </div>
      ))}
    </div>
  );
};

export default Loading;
