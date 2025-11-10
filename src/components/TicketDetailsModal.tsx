import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import type{ Ticket } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

interface TicketDetailsModalProps {
  ticketId: number;
  onClose: () => void;
}

export const TicketDetailsModal = ({ ticketId, onClose }: TicketDetailsModalProps) => {
  const { currentUser } = useAuth();
  const { tickets, updateTicket, addComment } = useApp();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  useEffect(() => {
    const foundTicket = tickets.find(t => t.id === ticketId);
    if (foundTicket) {
      setTicket(foundTicket);
      setStatus(foundTicket.status);
      setPriority(foundTicket.priority);
    }
  }, [ticketId, tickets]);

  if (!ticket) return null;

  const canEdit = currentUser?.role === 'support_agent' || currentUser?.role === 'admin';


  
  const handleUpdate = async () => {
    await updateTicket(ticket.id, { 
      status: status as "Open" | "In Progress" | "Resolved" | "Closed",
      priority: priority as "Low" | "Medium" | "High" | "Critical"
    });
    onClose();
  };


  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    await addComment(ticket.id, {
      authorId: currentUser!.id,
      content: newComment,
      internal: isInternal
    });

    setNewComment('');
    setIsInternal(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (s: string) => {
    const colors: Record<string, string> = {
      'Open': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Resolved': 'bg-green-100 text-green-800',
      'Closed': 'bg-gray-100 text-gray-800'
    };
    return colors[s] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (p: string) => {
    const colors: Record<string, string> = {
      'Low': 'bg-gray-100 text-gray-800',
      'Medium': 'bg-blue-100 text-blue-800',
      'High': 'bg-orange-100 text-orange-800',
      'Critical': 'bg-red-100 text-red-800'
    };
    return colors[p] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold text-gray-800">
            Ticket #{ticket.id} - {ticket.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-600">Status</span>
              <div className="mt-1">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </span>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Priority</span>
              <div className="mt-1">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Category</span>
              <p className="mt-1 text-gray-800">{ticket.category}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Department</span>
              <p className="mt-1 text-gray-800">{ticket.department}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Created</span>
              <p className="mt-1 text-gray-800">{formatDate(ticket.createdAt)}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Last Updated</span>
              <p className="mt-1 text-gray-800">{formatDate(ticket.updatedAt)}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {ticket.comments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Comments</h3>
              <div className="space-y-3">
                {ticket.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-4 rounded-lg ${comment.internal ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-800">User #{comment.authorId}</span>
                      <div className="flex gap-2 items-center">
                        <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                        {comment.internal && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                            Internal
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {canEdit && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800">Update Ticket</h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <button
                  onClick={handleUpdate}
                  className="self-end px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Add Comment</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a comment..."
                />
                <div className="mt-2 flex justify-between items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Internal comment (not visible to end user)</span>
                  </label>
                  <button
                    onClick={handleAddComment}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Comment
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
