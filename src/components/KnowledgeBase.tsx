import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { KnowledgeArticleModal } from './KnowledgeArticleModal';
import { marked } from 'marked';

export const KnowledgeBase = () => {
  const { currentUser } = useAuth();
  const { knowledgeBase, deleteKnowledgeArticle } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const canEdit = currentUser?.role === 'admin' || currentUser?.role === 'support_agent';

  const filteredArticles = knowledgeBase.filter(article => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(query) ||
      article.solution.toLowerCase().includes(query) ||
      article.keywords.some(keyword => keyword.toLowerCase().includes(query))
    );
  });

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this knowledge entry?')) return;
    await deleteKnowledgeArticle(id);
  };

  const handleEdit = (id: number) => {
    setSelectedArticleId(id);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedArticleId(null);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Knowledge Base</h2>
        {canEdit && (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Article
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search knowledge base..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {filteredArticles.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-600">No articles found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredArticles.map(article => (
            <div key={article.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {article.category}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{article.title}</h3>
              <div
                className="prose prose-sm max-w-none text-gray-600 mb-4"
                dangerouslySetInnerHTML={{ __html: marked(article.solution) }}
              />
              {canEdit && (
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(article.id)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <KnowledgeArticleModal
          articleId={selectedArticleId}
          onClose={() => {
            setShowModal(false);
            setSelectedArticleId(null);
          }}
        />
      )}
    </div>
  );
};
