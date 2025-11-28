import React, { useState, useEffect } from 'react';
import { UserProfile, RecommendationResponse } from '../types';
import { getRecommendations } from '../services/geminiService';
import { Sparkles, ShoppingBag, Mail, AlertTriangle, User, RefreshCw, ArrowRight } from 'lucide-react';

interface Props {
  user: UserProfile;
}

export const RecommendationEngine: React.FC<Props> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RecommendationResponse | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setData(null);
    try {
      const result = await getRecommendations(user);
      setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when user changes
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Left Column: User Profile Summary */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">User {user.id}</h2>
              <p className="text-sm text-slate-500">{user.location} • {user.age} Years Old</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500 text-sm">Category Affinity</span>
              <span className="font-medium text-slate-800">{user.productCategoryPreference}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500 text-sm">Income Tier</span>
              <span className="font-medium text-slate-800">₹{user.income.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500 text-sm">Engagement</span>
              <span className="font-medium text-slate-800">{user.timeSpentMinutes} mins</span>
            </div>
             <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500 text-sm">Last Seen</span>
              <span className="font-medium text-slate-800">{user.lastLoginDaysAgo} days ago</span>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Interests</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                {user.interests}
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                AOV: ₹{user.averageOrderValue}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: AI Insights */}
      <div className="lg:col-span-2">
        {loading ? (
          <div className="h-full bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center p-12 text-center">
            <div className="animate-spin text-indigo-600 mb-4">
              <RefreshCw size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-900">Generating Personalization...</h3>
            <p className="text-slate-500 mt-2">Gemini is analyzing {user.interests.toLowerCase()} trends for this profile.</p>
          </div>
        ) : data ? (
          <div className="space-y-6">
            
            {/* Top Card: Churn Risk & Subject Line */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-5 rounded-xl border-l-4 shadow-sm bg-white ${data.churnRisk === 'High' ? 'border-red-500' : data.churnRisk === 'Medium' ? 'border-yellow-500' : 'border-green-500'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={18} className={data.churnRisk === 'High' ? 'text-red-500' : data.churnRisk === 'Medium' ? 'text-yellow-500' : 'text-green-500'} />
                  <h4 className="font-semibold text-slate-800">Churn Risk: {data.churnRisk}</h4>
                </div>
                <p className="text-sm text-slate-600">
                  {data.churnRisk === 'High' ? 'Immediate re-engagement campaign needed.' : 'User shows healthy engagement patterns.'}
                </p>
              </div>

              <div className="p-5 rounded-xl border-l-4 border-indigo-500 shadow-sm bg-white">
                <div className="flex items-center gap-2 mb-2">
                   <Mail size={18} className="text-indigo-500" />
                   <h4 className="font-semibold text-slate-800">Recommended Subject Line</h4>
                </div>
                <p className="text-sm italic text-slate-700">"{data.marketingSubjectLine}"</p>
              </div>
            </div>

            {/* Main Reasoning */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={20} className="text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">AI Analysis</h3>
              </div>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {data.reasoning}
              </p>
            </div>

            {/* Products List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag size={20} className="text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">Curated Products</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {data.recommendedProducts.map((prod, idx) => (
                  <div key={idx} className="group relative overflow-hidden rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="bg-slate-100 h-32 flex items-center justify-center">
                       {/* Placeholder for product image */}
                       <img 
                        src={`https://picsum.photos/300/200?random=${idx + Number(user.id.replace('#', ''))}`} 
                        alt={prod}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                       />
                    </div>
                    <div className="p-4">
                      <h5 className="font-medium text-slate-900 mb-1">{prod}</h5>
                      <div className="flex items-center text-xs text-indigo-600 font-medium cursor-pointer">
                        View Item <ArrowRight size={12} className="ml-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="text-red-500">Failed to load recommendations.</div>
        )}
      </div>
    </div>
  );
};