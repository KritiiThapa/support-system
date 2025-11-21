import { useState, useEffect, useRef } from 'react';
import { Send, Plus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import type{ ChatMessage } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { ChatHistory } from './ChatHistory';
import { CreateTicketModal } from './CreateTicketModal';




export const ChatInterface = () => {

  const { currentUser } = useAuth();
  const {
    currentChatSession,
    startNewChat,
    addMessageToChat,
    knowledgeBase
  } = useApp();
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [ticketDescription, setTicketDescription] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentChatSession) {
      startNewChat();
    }
  }, [currentChatSession, startNewChat]);

  useEffect(() => {
    scrollToBottom();
  }, [currentChatSession?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    addMessageToChat(userMessage);
    const message = input;
    setInput('');

    await processChatMessage(message);
  };

  const processChatMessage = async (message: string) => {
    const lowerMessage = message.toLowerCase();

    const relevantArticles = knowledgeBase.filter(article =>
      article.keywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()))
    );

    if (relevantArticles.length > 0) {
      const article = relevantArticles[0];
      const response = `I found a solution for your issue:\n\n**${article.title}**\n\n${article.solution}`;

      const botMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };
      addMessageToChat(botMessage);
    } else {
      try {
        const resp = await fetch('http://localhost:8000/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: message,
            session_id: sessionId,
            user_id: currentUser?.id
          })
        });

        const data = await resp.json();
        if (resp.ok) {
          setSessionId(data.session_id || sessionId);
          const botMessage: ChatMessage = {
            role: 'assistant',
            content: data.response || 'I could not generate a response.',
            timestamp: new Date().toISOString()
          };
          addMessageToChat(botMessage);
        } else {
          const errorMessage: ChatMessage = {
            role: 'assistant',
            content: 'The chatbot service returned an error. Please try again later.',
            timestamp: new Date().toISOString()
          };
          addMessageToChat(errorMessage);
        }
      } catch (err) {
        console.error(err);
        const fallbackMessage: ChatMessage = {
          role: 'assistant',
          content: "I couldn't find a specific solution and the chatbot is unavailable. I can create a support ticket for you to get personalized help from our support team.",
          timestamp: new Date().toISOString()
        };
        addMessageToChat(fallbackMessage);

        setTimeout(() => {
          setTicketDescription(message);
          setShowCreateTicket(true);
        }, 1500);
      }
    }
  };

  const handleCreateTicketClick = (description: string) => {
    setTicketDescription(description);
    setShowCreateTicket(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
    
    <div className="flex gap-6 h-[calc(100vh-12rem)]">
      <ChatHistory />

      <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Support Chat</h2>
          <button
            onClick={() => startNewChat()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentChatSession?.messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Hello! I'm here to help you with technical support. Please describe your issue.</p>
            </div>
          )}

          {currentChatSession?.messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.role === 'assistant' && idx === currentChatSession.messages.length - 1 && (
                  <button
                    onClick={() => handleCreateTicketClick(currentChatSession.messages.find(m => m.role === 'user')?.content || '')}
                    className="mt-2 text-sm underline hover:no-underline"
                  >
                    Create a support ticket
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Send size={20} />
              Send
            </button>
          </div>
        </div>
      </div>

      {showCreateTicket && (
        <CreateTicketModal
          initialDescription={ticketDescription}
          onClose={() => setShowCreateTicket(false)}
        />
      )}
    </div>
    </>
  );
};
