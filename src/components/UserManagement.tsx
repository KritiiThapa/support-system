import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AddUserModal } from './AddUserModal';

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  department: string;
  active: boolean;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name');

    if (!error && data) {
      setUsers(data);
    }
  };

  const toggleUserStatus = async (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const { error } = await supabase
      .from('users')
      .update({ active: !user.active })
      .eq('id', userId);

    if (!error) {
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, active: !u.active } : u
      ));
    }
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add User
        </button>
      </div>

      <div className="grid gap-4">
        {users.map(user => (
          <div key={user.id} className="bg-white rounded-lg shadow-sm p-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
              <p className="text-gray-600 text-sm mt-1">
                {user.email} • {formatRole(user.role)} • {user.department}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                <strong>Username:</strong> {user.username} •{' '}
                <strong>Status:</strong> {user.active ? 'Active' : 'Inactive'}
              </p>
            </div>
            <button
              onClick={() => toggleUserStatus(user.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                user.active
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {user.active ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <AddUserModal
          onClose={() => {
            setShowModal(false);
            loadUsers();
          }}
        />
      )}
    </div>
  );
};
