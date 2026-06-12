import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from '@/components/common/Navigation';
import DreamPool from '@/pages/DreamPool';
import Publish from '@/pages/Publish';
import Relay from '@/pages/Relay';
import Collection from '@/pages/Collection';
import Profile from '@/pages/Profile';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-night-bg">
        <Routes>
          <Route path="/" element={<DreamPool />} />
          <Route path="/publish" element={<Publish />} />
          <Route path="/publish/:relayFromId" element={<Publish />} />
          <Route path="/relay" element={<Relay />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
        </Routes>
        <Navigation />
      </div>
    </BrowserRouter>
  );
};

export default App;
