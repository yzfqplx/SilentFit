import React from 'react';
import FitnessTheoryGraph from '../components/FitnessTheoryGraph';

const FitnessTheoryPage: React.FC = () => {
  return (
    <div className="fitness-theory-page overflow-hidden" style={{ height: '100%' }}>
      <div className="overflow-hidden" style={{ height: '100%' }}>
        <FitnessTheoryGraph />
      </div>
    </div>
  );
};

export default FitnessTheoryPage;