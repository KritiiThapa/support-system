import { Trash2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export const ChatHistory = () => {
  const { chatSessions, currentChatSession, switchChatSession, deleteChatSession } = useApp();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-80 bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Chat History</h3>

      {chatSessions.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">No chat history yet</p>
      ) : (
        <div className="space-y-2">
          {chatSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => switchChatSession(session.id)}
              className={`p-3 rounded-lg cursor-pointer transition-colors relative group ${
                session.id === currentChatSession?.id
                  ? 'bg-blue-50 border-2 border-blue-500'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <div className="pr-8">
                <h4 className="font-medium text-gray-800 text-sm truncate">
                  {session.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(session.updatedAt)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {session.messages.length} messages
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChatSession(session.id);
                }}
                className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete chat"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
