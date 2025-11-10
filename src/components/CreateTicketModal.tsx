import { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

interface CreateTicketModalProps {
  initialDescription?: string;
  onClose: () => void;
}

export const CreateTicketModal = ({ initialDescription = '', onClose }: CreateTicketModalProps) => {
  const { currentUser } = useAuth();
  const { createTicket } = useApp();
  const [title, setTitle] = useState(
    initialDescription ? initialDescription.split(' ').slice(0, 6).join(' ') + '...' : ''
  );
  const [description, setDescription] = useState(initialDescription);
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');

  const getDepartmentForCategory = (cat: string) => {
    const routingRules: Record<string, string> = {
      'hardware': 'IT',
      'software': 'IT',
      'network': 'IT',
      'password': 'IT',
      'authentication': 'IT',
      'digital banking': 'Digital Banking',
      'mobile app': 'Digital Banking',
      'core banking': 'Operations',
      'teller': 'Operations',
      'compliance': 'AML/CFT',
      'loan': 'Loan'
    };

    const catLower = cat.toLowerCase();
    for (const [keyword, dept] of Object.entries(routingRules)) {
      if (catLower.includes(keyword)) {
        return dept;
      }
    }
    return 'IT';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !category) {
      alert('Please fill in all required fields.');
      return;
    }

    const department = getDepartmentForCategory(category);

    await createTicket({
      title,
      description,
      category,
      priority,
      status: 'Open',
      createdBy: currentUser!.id,
      assignedTo: null,
      department
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Create Support Ticket</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of the issue"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a category</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Network">Network</option>
              <option value="Authentication">Authentication</option>
              <option value="Digital Banking">Digital Banking</option>
              <option value="Core Banking">Core Banking</option>
              <option value="Compliance">Compliance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High' | 'Critical')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Detailed description of the issue"
              required
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
