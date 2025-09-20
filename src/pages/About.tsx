import React from 'react';
import { Users, Target, Zap, Award } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Outreach Pro</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Revolutionizing B2B outreach with AI-powered email generation for service companies
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            At Outreach Pro, we believe that meaningful business connections shouldn't be left to chance. 
            Our platform empowers service companies to create highly personalized, contextually relevant 
            cold emails that resonate with potential clients' immediate needs.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            By leveraging advanced AI and machine learning, we transform generic outreach into strategic 
            conversations that highlight your unique value proposition while addressing specific hiring challenges.
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Smart Targeting</h3>
            <p className="text-gray-600">
              Match your services to real hiring needs with precision-crafted outreach messages.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Zap className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Intelligence</h3>
          <p className="text-gray-600">
            Our advanced LLM technology extracts valuable insights from job listings and creates 
            compelling email content that speaks directly to hiring managers.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Team Collaboration</h3>
          <p className="text-gray-600">
            Built for business development teams to work together efficiently, sharing insights 
            and optimizing outreach strategies across multiple campaigns.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Award className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Proven Results</h3>
          <p className="text-gray-600">
            Our clients report significantly higher response rates and faster deal closure 
            through contextually relevant, value-driven outreach communications.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Outreach?</h2>
        <p className="text-indigo-100 text-lg mb-6 max-w-2xl mx-auto">
          Join hundreds of service companies that have already elevated their business development 
          with intelligent, personalized cold email campaigns.
        </p>
        <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
          Start Your Free Trial
        </button>
      </div>
    </div>
  );
};