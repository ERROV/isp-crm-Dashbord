import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';

// This component is a remnant of a previous non-Next.js architecture.
// All routing and state management has been migrated to the Next.js `pages`
// directory, primarily `pages/_app.tsx`. This file is no longer used
// in the application and can be safely removed.

const App: React.FC = () => {
  return (
    <ThemeProvider>
        <LanguageProvider>
          <p>This entry point is deprecated. The application is rendered via Next.js pages.</p>
        </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
