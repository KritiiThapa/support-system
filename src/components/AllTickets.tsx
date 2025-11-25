import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { TicketCard } from './TicketCard';
import { TicketDetailsModal } from './TicketDetailsModal';
import Chatbot from './Chatbot';

export const AllTickets = () => {
  const { tickets, departments } = useApp();
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  let filteredTickets = [...tickets];

  if (statusFilter) {
    filteredTickets = filteredTickets.filter(t => t.status === statusFilter);
  }

  if (departmentFilter) {
    filteredTickets = filteredTickets.filter(t => t.department === departmentFilter);
  }

  return (
    <>
    <Chatbot/>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">All Tickets</h2>
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
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="department-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Department
            </label>
            <select
              id="department-filter"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-600">No tickets found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTickets.map(ticket => (
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
