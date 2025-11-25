import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { TicketCard } from './TicketCard';
import { TicketDetailsModal } from './TicketDetailsModal';
import Chatbot from './Chatbot';

export const AgentDashboard = () => {
  const { currentUser } = useAuth();
  const { tickets } = useApp();
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  let agentTickets = tickets.filter(t =>
    (t.department === currentUser?.department || t.assignedTo === currentUser?.id) &&
    t.status !== 'Closed'
  );

  if (statusFilter) {
    agentTickets = agentTickets.filter(t => t.status === statusFilter);
  }

  if (priorityFilter) {
    agentTickets = agentTickets.filter(t => t.priority === priorityFilter);
  }

  return (
    <>
    <Chatbot/>

    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Support Queue</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Priority
            </label>
            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {agentTickets.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-600">
            No tickets in your queue. New tickets will appear here when they are assigned to your department.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {agentTickets.map(ticket => (
            <TicketCard
            key={ticket.id}
            ticket={ticket}
            onClick={() => setSelectedTicketId(ticket.id)}
            />
          ))}
        </div>
      )}

      {selectedTicketId && (
        <TicketDetailsModal
        ticketId={selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
        />
      )}
    </div>
      </>
  );
};
