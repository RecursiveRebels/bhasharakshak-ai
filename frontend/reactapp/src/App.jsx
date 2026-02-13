import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import { Contribute } from './pages/Contribute';
import { Translate } from './pages/Translate';
import { Learn } from './pages/Learn';
import { MyCollections } from './pages/MyCollections';
import { ThemeProvider } from './context/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';


import { LanguageSelector } from './pages/LanguageSelector';
import { VisualHeritage } from './pages/VisualHeritage';
import { TutorialProvider } from './context/TutorialContext';
import { LanguageAssets } from './pages/LanguageAssets';

// ...

function App() {
  const [isLanguageSelected, setIsLanguageSelected] = React.useState(!!localStorage.getItem('hasSeenLanguageSelector'));

  if (!isLanguageSelected) {
    return <LanguageSelector onComplete={() => setIsLanguageSelected(true)} />;
  }

  return (
    <ThemeProvider>
      <SidebarProvider>
        <Router>
          <TutorialProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contribute" element={<Contribute />} />
                <Route path="/translate" element={<Translate />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/learn/:language" element={<LanguageAssets />} />
                <Route path="/my-collections" element={<MyCollections />} />
                <Route path="/visual-heritage" element={<VisualHeritage />} />
              </Routes>
            </Layout>
          </TutorialProvider>
        </Router>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
