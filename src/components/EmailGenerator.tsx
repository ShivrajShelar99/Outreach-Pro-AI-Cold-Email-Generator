import React, { useState } from 'react';
import { Globe, Zap } from 'lucide-react';

interface EmailGeneratorProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export const EmailGenerator: React.FC<EmailGeneratorProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Career Page URL</h2>
        <p className="text-gray-600">
          Paste the careers page URL of your target company to extract job listings
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Company Career Page URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://company.com/careers"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            required
          />
          {url && !isValidUrl(url) && (
            <p className="mt-1 text-sm text-red-600">Please enter a valid URL</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !url.trim() || !isValidUrl(url)}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Extracting Jobs...</span>
            </>
          ) : (
            <>
              <Zap className="h-5 w-5" />
              <span>Extract Job Listings</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">How it works:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Our AI extracts job listings from the career page</li>
          <li>• Select a job that matches your service offerings</li>
          <li>• Generate a personalized cold email with portfolio links</li>
          <li>• Copy and send your targeted outreach message</li>
        </ul>
      </div>
    </div>
  );
};