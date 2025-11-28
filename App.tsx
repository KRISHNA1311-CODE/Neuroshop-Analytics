import React, { useState, useRef } from 'react';
import { Dashboard } from './components/Dashboard';
import { UserList } from './components/UserList';
import { RecommendationEngine } from './components/RecommendationEngine';
import { MOCK_DATA } from './constants';
import { ViewState, UserProfile } from './types';
import { LayoutDashboard, Users, BrainCircuit, BarChart3, Upload, FileUp } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [userData, setUserData] = useState<UserProfile[]>(MOCK_DATA);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedUser = userData.find(u => u.id === selectedUserId) || userData[0];

  const handleUserSelect = (id: string) => {
    setSelectedUserId(id);
    setView(ViewState.RECOMMENDER);
    // Scroll to top for mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n');
    const newData: UserProfile[] = [];

    // Skip header row (index 0)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Handle CSV splitting (assuming simple CSV with no commas inside quotes for now, based on provided sample)
      const parts = line.split(',');
      
      // Expected format based on provided sample:
      // Index, User_ID, Age, Gender, Location, Income, Interests, Last_Login, Freq, AOV, Total, Category, Time, Pages, Newsletter
      // 0,     #1,      56,  Male,   Suburban, 38037,  Sports,    5,          7,    18,  2546,  Books,    584,  38,    True
      
      if (parts.length >= 15) {
        try {
          const profile: UserProfile = {
            id: parts[1].trim(),
            age: parseInt(parts[2]),
            gender: parts[3].trim(),
            location: parts[4].trim(),
            income: parseInt(parts[5]),
            interests: parts[6].trim(),
            lastLoginDaysAgo: parseInt(parts[7]),
            purchaseFrequency: parseInt(parts[8]),
            averageOrderValue: parseInt(parts[9]),
            totalSpending: parseInt(parts[10]),
            productCategoryPreference: parts[11].trim(),
            timeSpentMinutes: parseInt(parts[12]),
            pagesViewed: parseInt(parts[13]),
            newsletterSubscription: parts[14].toLowerCase().trim() === 'true'
          };
          
          if (!isNaN(profile.income)) { // Basic validation
             newData.push(profile);
          }
        } catch (e) {
          console.error("Error parsing line:", line, e);
        }
      }
    }

    if (newData.length > 0) {
      setUserData(newData);
      setSelectedUserId(null); // Reset selection
      setView(ViewState.DASHBOARD); // Go to dashboard to see new data stats
      alert(`Successfully loaded ${newData.length} user profiles.`);
    } else {
      alert("Could not parse valid user data from the CSV file. Please check the format.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.onerror = () => {
      alert("Failed to read file.");
    };
    reader.readAsText(file);
    
    // Reset input so same file can be selected again if needed
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <BrainCircuit size={24} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 hidden sm:inline-block">
                NeuroShop Analytics
              </span>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 sm:hidden">
                NeuroShop
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex space-x-6 mr-4">
                <button 
                  onClick={() => setView(ViewState.DASHBOARD)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${view === ViewState.DASHBOARD ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  <LayoutDashboard size={18} />
                  Overview
                </button>
                <button 
                  onClick={() => setView(ViewState.EXPLORER)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${view === ViewState.EXPLORER ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  <Users size={18} />
                  User Explorer
                </button>
                <button 
                  onClick={() => setView(ViewState.RECOMMENDER)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${view === ViewState.RECOMMENDER ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  <BarChart3 size={18} />
                  AI Insights
                </button>
              </nav>

              <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".csv" 
                className="hidden" 
              />
              <button 
                onClick={handleUploadClick}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors"
                title="Upload CSV Data"
              >
                <Upload size={18} />
                <span className="hidden sm:inline">Upload Data</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 flex justify-around">
        <button onClick={() => setView(ViewState.DASHBOARD)} className={`p-2 ${view === ViewState.DASHBOARD ? 'text-indigo-600' : 'text-slate-400'}`}><LayoutDashboard /></button>
        <button onClick={() => setView(ViewState.EXPLORER)} className={`p-2 ${view === ViewState.EXPLORER ? 'text-indigo-600' : 'text-slate-400'}`}><Users /></button>
        <button onClick={() => setView(ViewState.RECOMMENDER)} className={`p-2 ${view === ViewState.RECOMMENDER ? 'text-indigo-600' : 'text-slate-400'}`}><BarChart3 /></button>
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {!process.env.API_KEY && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    API Key not detected. The AI features will use mock data responses. Please check your environment configuration.
                  </p>
                </div>
              </div>
            </div>
          )}

          {view === ViewState.DASHBOARD && (
            <div>
              <div className="mb-6 flex justify-between items-end">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                  <p className="text-slate-500">Real-time insights into customer demographics and sales performance.</p>
                </div>
                <div className="text-sm text-slate-400">
                   Data source: {userData.length > 50 ? 'Imported CSV' : 'Sample Data'} ({userData.length} records)
                </div>
              </div>
              <Dashboard data={userData} />
            </div>
          )}

          {view === ViewState.EXPLORER && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                 <div className="mb-6">
                  <h1 className="text-2xl font-bold text-slate-900">User Explorer</h1>
                  <p className="text-slate-500">Browse individual user profiles to analyze behavior.</p>
                </div>
                <UserList users={userData} selectedUserId={selectedUserId} onSelectUser={handleUserSelect} />
              </div>
              <div className="hidden lg:block">
                 <div className="bg-indigo-600 rounded-xl p-6 text-white h-full flex flex-col justify-center items-center text-center">
                    <Users size={48} className="mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold">Select a User</h3>
                    <p className="text-indigo-200 mt-2">Click on a row in the table to view detailed AI insights and product recommendations.</p>
                 </div>
              </div>
            </div>
          )}

          {view === ViewState.RECOMMENDER && (
            <div>
               <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">AI Recommendation Engine</h1>
                  <p className="text-slate-500">Personalized marketing strategies generated by Gemini 2.5 Flash.</p>
                </div>
                <button 
                  onClick={() => setView(ViewState.EXPLORER)}
                  className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
                >
                  Change User
                </button>
              </div>
              <RecommendationEngine user={selectedUser} />
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;