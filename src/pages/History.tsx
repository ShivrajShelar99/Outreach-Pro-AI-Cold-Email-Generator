import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Clock, Search, Filter, Download, Eye } from 'lucide-react';
import { GeneratedEmailData } from './Dashboard';
import { historyService } from '../services/historyService';
import { exportService } from '../services/exportService';

export const History: React.FC = () => {
  const [emails, setEmails] = useState<GeneratedEmailData[]>([]);
  const [filteredEmails, setFilteredEmails] = useState<GeneratedEmailData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<GeneratedEmailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    filterEmails();
  }, [emails, searchTerm, filterCompany]);

  const loadHistory = async () => {
    try {
      const history = await historyService.getHistory();
      setEmails(history);
    } catch (error) {
      toast.error('Failed to load history');
    } finally {
      setIsLoading(false);
    }
  };

  const filterEmails = () => {
    let filtered = emails;

    if (searchTerm) {
      filtered = filtered.filter(
        (email) =>
          email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.jobListing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.jobListing.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCompany) {
      filtered = filtered.filter((email) =>
        email.jobListing.company.toLowerCase().includes(filterCompany.toLowerCase())
      );
    }

    setFilteredEmails(filtered);
    setCurrentPage(1);
  };

  const handleExport = async (email: GeneratedEmailData, format: 'pdf' | 'txt') => {
    try {
      if (format === 'pdf') {
        await exportService.exportToPDF(email);
      } else {
        await exportService.exportToTXT(email);
      }
      toast.success(`Email exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export email');
    }
  };

  const paginatedEmails = filteredEmails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredEmails.length / itemsPerPage);

  const uniqueCompanies = [...new Set(emails.map(email => email.jobListing.company))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-white" />
            <div>
              <h1 className="text-3xl font-bold text-white">Email History</h1>
              <p className="text-purple-100 mt-1">
                View and manage your generated emails
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Companies</option>
                {uniqueCompanies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Email List */}
          {filteredEmails.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No emails found</h3>
              <p className="text-gray-600">
                {emails.length === 0
                  ? 'Start generating emails to see your history here.'
                  : 'Try adjusting your search or filter criteria.'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Subject</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Company</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Job Title</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedEmails.map((email) => (
                      <tr key={email.id} className="hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900 truncate max-w-xs">
                            {email.subject}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {email.jobListing.company}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {email.jobListing.title}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {new Date(email.timestamp).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedEmail(email)}
                              className="text-blue-600 hover:text-blue-800"
                              title="View Email"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleExport(email, 'pdf')}
                              className="text-emerald-600 hover:text-emerald-800"
                              title="Export PDF"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleExport(email, 'txt')}
                              className="text-gray-600 hover:text-gray-800"
                              title="Export TXT"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                    {Math.min(currentPage * itemsPerPage, filteredEmails.length)} of{' '}
                    {filteredEmails.length} emails
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 border rounded text-sm ${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Email Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Email Details</h2>
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-gray-900">{selectedEmail.subject}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <div className="bg-gray-50 rounded p-3">
                    <pre className="whitespace-pre-wrap text-sm text-gray-900 font-mono">
                      {selectedEmail.content}
                    </pre>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleExport(selectedEmail, 'pdf')}
                    className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
                  >
                    Export PDF
                  </button>
                  <button
                    onClick={() => handleExport(selectedEmail, 'txt')}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Export TXT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};