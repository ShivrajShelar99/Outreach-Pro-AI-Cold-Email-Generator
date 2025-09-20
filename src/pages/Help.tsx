import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, BookOpen, Video, MessageCircle } from 'lucide-react';

export const Help: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does Outreach Pro extract job listings?",
      answer: "Our AI-powered system uses advanced web scraping and natural language processing to analyze career pages and extract relevant job information including titles, requirements, and descriptions. The system is designed to work with most major career page formats."
    },
    {
      question: "What makes the generated emails personalized?",
      answer: "Each email is tailored based on the specific job requirements, company context, and matched portfolio projects. Our AI analyzes the job description to understand pain points and creates content that directly addresses the hiring manager's needs."
    },
    {
      question: "How accurate is the portfolio matching?",
      answer: "We use semantic similarity algorithms to match your portfolio projects with job requirements. The system analyzes technical skills, industry context, and project scope to find the most relevant examples that demonstrate your capabilities."
    },
    {
      question: "Can I customize the email tone and style?",
      answer: "Yes! In your profile settings, you can adjust the tone (professional, friendly, casual, formal), email length, and other preferences. The AI will adapt the generated content to match your specified style."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade security measures including encrypted data transmission, secure storage, and strict access controls. Your data is never shared with third parties without your explicit consent."
    },
    {
      question: "What formats can I export emails in?",
      answer: "Generated emails can be exported in PDF and TXT formats. You can also copy emails directly to your clipboard for easy pasting into your preferred email client."
    },
    {
      question: "How many emails can I generate?",
      answer: "This depends on your subscription plan. Our free tier allows 5 emails per month, while paid plans offer unlimited generation with additional features like team collaboration and advanced analytics."
    },
    {
      question: "Does it work with all career pages?",
      answer: "Our system is designed to work with most standard career page formats. However, some heavily customized or protected pages may not be fully supported. We continuously improve our extraction capabilities."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find answers to common questions and learn how to get the most out of Outreach Pro
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Documentation</h3>
          <p className="text-gray-600 mb-4">
            Comprehensive guides and tutorials to help you master every feature of Outreach Pro.
          </p>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            View Documentation →
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Video className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Video Tutorials</h3>
          <p className="text-gray-600 mb-4">
            Step-by-step video guides showing you how to create effective cold email campaigns.
          </p>
          <button className="text-emerald-600 hover:text-emerald-700 font-medium">
            Watch Tutorials →
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Live Chat</h3>
          <p className="text-gray-600 mb-4">
            Get instant help from our support team through our live chat feature.
          </p>
          <button className="text-purple-600 hover:text-purple-700 font-medium">
            Start Chat →
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-8 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <HelpCircle className="h-8 w-8 text-white" />
            <div>
              <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
              <p className="text-orange-100 mt-1">
                Quick answers to the most common questions
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Still Need Help?</h2>
        <p className="text-blue-100 mb-6">
          Can't find the answer you're looking for? Our support team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Contact Support
          </button>
          <button className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
            Schedule a Call
          </button>
        </div>
      </div>
    </div>
  );
};