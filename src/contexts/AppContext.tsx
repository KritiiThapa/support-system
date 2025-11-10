import { createContext, useContext, useState, useEffect} from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdBy: number;
  assignedTo: number | null;
  department: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

export interface Comment {
  id: number;
  authorId: number;
  content: string;
  internal: boolean;
  createdAt: string;
}

export interface KnowledgeArticle {
  id: number;
  title: string;
  category: string;
  solution: string;
  keywords: string[];
}

export interface Department {
  id: number;
  name: string;
  description: string;
}

export interface ChatSession {
  id: string;
  userId: number;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AppContextType {
  tickets: Ticket[];
  knowledgeBase: KnowledgeArticle[];
  departments: Department[];
  chatSessions: ChatSession[];
  currentChatSession: ChatSession | null;
  loadTickets: () => Promise<void>;
  loadKnowledgeBase: () => Promise<void>;
  loadDepartments: () => Promise<void>;
  loadChatSessions: () => Promise<void>;
  createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => Promise<void>;
  updateTicket: (id: number, updates: Partial<Ticket>) => Promise<void>;
  addComment: (ticketId: number, comment: Omit<Comment, 'id' | 'createdAt'>) => Promise<void>;
  createKnowledgeArticle: (article: Omit<KnowledgeArticle, 'id'>) => Promise<void>;
  updateKnowledgeArticle: (id: number, article: Omit<KnowledgeArticle, 'id'>) => Promise<void>;
  deleteKnowledgeArticle: (id: number) => Promise<void>;
  startNewChat: () => ChatSession;
  switchChatSession: (sessionId: string) => void;
  addMessageToChat: (message: ChatMessage) => void;
  deleteChatSession: (sessionId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeArticle[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatSession, setCurrentChatSession] = useState<ChatSession | null>(null);
  const [nextSessionId, setNextSessionId] = useState(1);

  useEffect(() => {
    if (currentUser) {
      loadTickets();
      loadKnowledgeBase();
      loadDepartments();
      loadChatSessions();
    }
  }, [currentUser]);

  const loadTickets = async () => {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('createdAt', { ascending: false });

    if (!error && data) {
      setTickets(data);
    }
  };

  const loadKnowledgeBase = async () => {
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*')
      .order('title');

    if (!error && data) {
      setKnowledgeBase(data);
    }
  };

  const loadDepartments = async () => {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name');

    if (!error && data) {
      setDepartments(data);
    }
  };

  const loadChatSessions = async () => {
    if (!currentUser) return;

    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('userId', currentUser.id)
      .order('updatedAt', { ascending: false });

    if (!error && data) {
      setChatSessions(data);
      const activeSession = data.find(s => s.isActive);
      if (activeSession) {
        setCurrentChatSession(activeSession);
      }
    }
  };

  const createTicket = async (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    const { data, error } = await supabase
      .from('tickets')
      .insert({
        ...ticket,
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select()
      .single();

    if (!error && data) {
      setTickets(prev => [data, ...prev]);
    }
  };

  const updateTicket = async (id: number, updates: Partial<Ticket>) => {
    const { data, error } = await supabase
      .from('tickets')
      .update({ ...updates, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setTickets(prev => prev.map(t => t.id === id ? data : t));
    }
  };

  const addComment = async (ticketId: number, comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const newComment = {
      ...comment,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };

    const updatedComments = [...ticket.comments, newComment];

    await updateTicket(ticketId, { comments: updatedComments });
  };

  const createKnowledgeArticle = async (article: Omit<KnowledgeArticle, 'id'>) => {
    const { data, error } = await supabase
      .from('knowledge_base')
      .insert(article)
      .select()
      .single();

    if (!error && data) {
      setKnowledgeBase(prev => [...prev, data]);
    }
  };

  const updateKnowledgeArticle = async (id: number, article: Omit<KnowledgeArticle, 'id'>) => {
    const { data, error } = await supabase
      .from('knowledge_base')
      .update(article)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setKnowledgeBase(prev => prev.map(a => a.id === id ? data : a));
    }
  };

  const deleteKnowledgeArticle = async (id: number) => {
    const { error } = await supabase
      .from('knowledge_base')
      .delete()
      .eq('id', id);

    if (!error) {
      setKnowledgeBase(prev => prev.filter(a => a.id !== id));
    }
  };

  const startNewChat = (): ChatSession => {
    if (!currentUser) throw new Error('No user logged in');

    const newSession: ChatSession = {
      id: `session_${currentUser.id}_${nextSessionId}`,
      userId: currentUser.id,
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    };

    setChatSessions(prev => {
      const updated = prev.map(s => ({ ...s, isActive: false }));
      return [newSession, ...updated];
    });

    setCurrentChatSession(newSession);
    setNextSessionId(prev => prev + 1);

    return newSession;
  };

  const switchChatSession = (sessionId: string) => {
    setChatSessions(prev => prev.map(s => ({
      ...s,
      isActive: s.id === sessionId
    })));

    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentChatSession({ ...session, isActive: true });
    }
  };

  const addMessageToChat = (message: ChatMessage) => {
    if (!currentChatSession) {
      startNewChat();
    }

    setChatSessions(prev => prev.map(s => {
      if (s.id === currentChatSession?.id) {
        const updatedMessages = [...s.messages, message];
        const updatedSession = {
          ...s,
          messages: updatedMessages,
          updatedAt: new Date().toISOString(),
          title: s.title === 'New Chat' && message.role === 'user'
            ? message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '')
            : s.title
        };
        setCurrentChatSession(updatedSession);
        return updatedSession;
      }
      return s;
    }));
  };

  const deleteChatSession = (sessionId: string) => {
    setChatSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);

      if (currentChatSession?.id === sessionId) {
        if (filtered.length > 0) {
          setCurrentChatSession({ ...filtered[0], isActive: true });
        } else {
          startNewChat();
        }
      }

      return filtered;
    });
  };

  return (
    <AppContext.Provider value={{
      tickets,
      knowledgeBase,
      departments,
      chatSessions,
      currentChatSession,
      loadTickets,
      loadKnowledgeBase,
      loadDepartments,
      loadChatSessions,
      createTicket,
      updateTicket,
      addComment,
      createKnowledgeArticle,
      updateKnowledgeArticle,
      deleteKnowledgeArticle,
      startNewChat,
      switchChatSession,
      addMessageToChat,
      deleteChatSession
    }}>
      {children}
    </AppContext.Provider>
  );
};
