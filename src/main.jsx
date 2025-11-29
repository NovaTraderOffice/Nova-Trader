import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import AppWrapper from '@/AppWrapper';
import { Toaster } from '@/components/ui/Toaster';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Router>
      <AppWrapper />
      <Toaster />
    </Router>
  </>
);