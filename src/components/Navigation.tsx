import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, Ticket, BookOpen, LayoutDashboard, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navigation = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) return null;

  const navItems = (() => {
    switch (currentUser.role) {
      case 'end_user':
        return [
          { label: 'Support Chat', path: '/chat', icon: <MessageSquare size={20} /> },
          { label: 'My Tickets', path: '/my-tickets', icon: <Ticket size={20} /> },
          { label: 'Knowledge Base', path: '/knowledge-base', icon: <BookOpen size={20} /> },
        ];
      case 'support_agent':
        return [
          { label: 'Support Queue', path: '/agent', icon: <Ticket size={20} /> },
          { label: 'Knowledge Base', path: '/knowledge-base', icon: <BookOpen size={20} /> },
        ];
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
          { label: 'All Tickets', path: '/all-tickets', icon: <Ticket size={20} /> },
          { label: 'User Management', path: '/user-management', icon: <Users size={20} /> },
          { label: 'Knowledge Base', path: '/knowledge-base', icon: <BookOpen size={20} /> },
        ];
      default: return [];
    }
  })();

  return (
    <nav className="bg-white shadow-sm rounded-lg p-2 mb-6">
      <div className="flex gap-2 flex-wrap">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              location.pathname === item.path ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
