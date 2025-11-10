import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- important
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { GoogleOAuthProvider } from "@react-oauth/google"; 
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={"525042957149-32rg9bb17lhqv9t1mn26jki42hc9nbsj.apps.googleusercontent.com"}>

    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
