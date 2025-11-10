import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { ChatInterface } from './components/ChatInterface';
import { MyTickets } from './components/MyTickets';
import { AgentDashboard } from './components/AgentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AllTickets } from './components/AllTickets';
import { UserManagement } from './components/UserManagement';
import { KnowledgeBase } from './components/KnowledgeBase';
import { Navigation } from './components/Navigation';


export default function App() {
  const { currentUser, isLoading } = useAuth();

  const getDefaultRoute = (role: string) => {
    switch (role) {
      case 'end_user': return '/chat';
      case 'support_agent': return '/agent';
      case 'admin': return '/admin';
      default: return '/chat';
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!currentUser) return <Login />;

  return (
    <Layout>
      <Navigation />
      <Routes>
        {/* Shared pages */}
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/my-tickets" element={<MyTickets />} />
        <Route path="/knowledge-base" element={<KnowledgeBase />} />

        {/* Agent-only */}
        <Route
          path="/agent"
          element={
            currentUser.role === 'support_agent'
              ? <AgentDashboard />
              : <Navigate to={getDefaultRoute(currentUser.role)} />
          }
        />

        {/* Admin-only */}
        <Route
          path="/admin"
          element={
            currentUser.role === 'admin'
              ? <AdminDashboard />
              : <Navigate to={getDefaultRoute(currentUser.role)} />
          }
        />
        <Route
          path="/all-tickets"
          element={
            currentUser.role === 'admin'
              ? <AllTickets />
              : <Navigate to={getDefaultRoute(currentUser.role)} />
          }
        />
        <Route
          path="/user-management"
          element={
            currentUser.role === 'admin'
              ? <UserManagement />
              : <Navigate to={getDefaultRoute(currentUser.role)} />
          }
        />

        {/* Default fallback */}
        <Route path="*" element={<Navigate to={getDefaultRoute(currentUser.role)} />} />
      </Routes>
    </Layout>
  );
  
}
