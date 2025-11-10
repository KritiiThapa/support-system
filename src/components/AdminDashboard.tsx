import { useApp } from '../contexts/AppContext';

export const AdminDashboard = () => {
  const { tickets, departments } = useApp();

  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'Open').length;
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved').length;

  const departmentStats = departments.map(dept => ({
    name: dept.name,
    count: tickets.filter(t => t.department === dept.name && t.status !== 'Closed').length
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Tickets</h3>
          <p className="text-3xl font-bold text-gray-800">{totalTickets}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Open Tickets</h3>
          <p className="text-3xl font-bold text-blue-600">{openTickets}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Resolved Tickets</h3>
          <p className="text-3xl font-bold text-green-600">{resolvedTickets}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Statistics</h3>
        <div className="space-y-3">
          {departmentStats.map((dept) => (
            <div key={dept.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">{dept.name}</span>
              <span className="text-lg font-bold text-gray-800">
                {dept.count} <span className="text-sm font-normal text-gray-600">open tickets</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
