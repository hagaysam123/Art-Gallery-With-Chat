import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Gallery = lazy(() => import('./components/Gallery'));
const Discussion = lazy(() => import('./components/Discussion'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/discussion/:id" element={<Discussion />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
