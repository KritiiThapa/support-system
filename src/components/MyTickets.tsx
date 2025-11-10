import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { TicketCard } from './TicketCard';
import { TicketDetailsModal } from './TicketDetailsModal';

export const MyTickets = () => {
  const { currentUser } = useAuth();
  const { tickets } = useApp();
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  const userTickets = tickets.filter(t => t.createdBy === currentUser?.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Tickets</h2>
      </div>

      {userTickets.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-600">
            You have no tickets yet. Start a conversation in the Support Chat to get help with your technical issues.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {userTickets.map(ticket => (
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
  );
};
