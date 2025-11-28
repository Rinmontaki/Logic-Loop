import React, { useState } from 'react';
import { ChallengeList } from '../components/ChallengeList';
import { ChallengeDetail } from '../components/ChallengeDetail';
import '../stylesRetosLPP.css';

export default function RetosLPP() {
  const [currentView, setCurrentView] = useState('list');
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const handleSelectChallenge = (challenge) => {
    setSelectedChallenge(challenge);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedChallenge(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {currentView === 'list' ? (
        <ChallengeList onSelectChallenge={handleSelectChallenge} />
      ) : (
        selectedChallenge && (
          <ChallengeDetail 
            challenge={selectedChallenge} 
            onBack={handleBackToList}
          />
        )
      )}
    </div>
  );
}
