import { RouterProvider } from 'react-router';
import { router } from './routes.tsx';
import { Toaster } from './components/ui/sonner';
import { ContentProvider } from './contexts/ContentContext';
import { AuthProvider } from './contexts/AuthContext';
import { Favicon } from './components/Favicon';
import { HelmetProvider } from 'react-helmet-async';
import Preloader from './components/Preloader';

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ContentProvider>
          <Favicon />

          {/* Website Preloader */}
          <Preloader />

          <RouterProvider router={router} />
          <Toaster />
        </ContentProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}