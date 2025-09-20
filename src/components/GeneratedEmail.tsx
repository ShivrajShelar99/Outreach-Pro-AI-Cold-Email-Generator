import React, { useState } from 'react';
import { ArrowLeft, Copy, Download, RefreshCw, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { GeneratedEmailData } from '../pages/Dashboard';
import { exportService } from '../services/exportService';

interface GeneratedEmailProps {
  email: GeneratedEmailData;
  onReset: () => void;
  onBack: () => void;
}

export const GeneratedEmail: React.FC<GeneratedEmailProps> = ({ email, onReset, onBack }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email.content);
      toast.success('Email copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy email');
    }
  };

  const handleExport = async (format: 'pdf' | 'txt') => {
    setIsExporting(true);
    try {
      if (format === 'pdf') {
        await exportService.exportToPDF(email);
      } else {
        await exportService.exportToTXT(email);
      }
      toast.success(`Email exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export email');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Jobs</span>
        </button>
        <button
          onClick={onReset}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Start Over</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
          <div className="flex items-center space-x-3">
            <Mail className="h-6 w-6 text-white" />
            <h2 className="text-xl font-bold text-white">Generated Email</h2>
          </div>
        </div>

        <div className="p-6">
          {/* Email Subject */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <div className="bg-gray-50 rounded-lg p-3 border">
              <p className="text-gray-900 font-medium">{email.subject}</p>
            </div>
          </div>

          {/* Email Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Content</label>
            <div className="bg-gray-50 rounded-lg p-4 border">
              <pre className="whitespace-pre-wrap text-gray-900 font-mono text-sm leading-relaxed">
                {email.content}
              </pre>
            </div>
          </div>

          {/* Portfolio Links */}
          {email.portfolioLinks.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matched Portfolio Links
              </label>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <ul className="space-y-2">
                  {email.portfolioLinks.map((link, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Job Details */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Job</label>
            <div className="bg-gray-50 rounded-lg p-4 border">
              <h3 className="font-semibold text-gray-900 mb-2">{email.jobListing.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{email.jobListing.company}</p>
              <div className="flex flex-wrap gap-2">
                {email.jobListing.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Copy className="h-4 w-4" />
              <span>Copy Email</span>
            </button>
            <button
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={() => handleExport('txt')}
              disabled={isExporting}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>Export TXT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};