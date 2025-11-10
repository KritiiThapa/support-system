import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface KnowledgeArticleModalProps {
  articleId: number | null;
  onClose: () => void;
}

export const KnowledgeArticleModal = ({ articleId, onClose }: KnowledgeArticleModalProps) => {
  const { knowledgeBase, createKnowledgeArticle, updateKnowledgeArticle } = useApp();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [solution, setSolution] = useState('');
  const [keywords, setKeywords] = useState('');

  useEffect(() => {
    if (articleId) {
      const article = knowledgeBase.find(a => a.id === articleId);
      if (article) {
        setTitle(article.title);
        setCategory(article.category);
        setSolution(article.solution);
        setKeywords(article.keywords.join(', '));
      }
    }
  }, [articleId, knowledgeBase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !category.trim() || !solution.trim()) {
      alert('All fields except keywords are required.');
      return;
    }

    const articleData = {
      title,
      category,
      solution,
      keywords: keywords.split(',').map(k => k.trim()).filter(k => k)
    };

    if (articleId) {
      await updateKnowledgeArticle(articleId, articleData);
    } else {
      await createKnowledgeArticle(articleData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            {articleId ? 'Edit Knowledge Article' : 'Add Knowledge Article'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Article title"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Authentication, Hardware, Software"
              required
            />
          </div>

          <div>
            <label htmlFor="solution" className="block text-sm font-medium text-gray-700 mb-1">
              Solution <span className="text-red-500">*</span>
            </label>
            <textarea
              id="solution"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Detailed solution (supports Markdown)"
              required
            />
          </div>

          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., password, reset, login, authentication"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {articleId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
