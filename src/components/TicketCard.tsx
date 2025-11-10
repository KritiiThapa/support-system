import type{ Ticket } from '../contexts/AppContext';

interface TicketCardProps {
  ticket: Ticket;
  onClick: () => void;
}

export const TicketCard = ({ ticket, onClick }: TicketCardProps) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Open': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Resolved': 'bg-green-100 text-green-800',
      'Closed': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'Low': 'bg-gray-100 text-gray-800',
      'Medium': 'bg-blue-100 text-blue-800',
      'High': 'bg-orange-100 text-orange-800',
      'Critical': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Ticket #{ticket.id}</p>
          <h3 className="text-lg font-semibold text-gray-800">{ticket.title}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
          {ticket.status}
        </span>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{ticket.description}</p>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <div>
          <span className="font-medium">Priority: </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
            {ticket.priority}
          </span>
        </div>
        <div>
          <span className="font-medium">Department: </span>
          {ticket.department}
        </div>
        <div>
          <span className="font-medium">Created: </span>
          {formatDate(ticket.createdAt)}
        </div>
      </div>
    </div>
  );
};
