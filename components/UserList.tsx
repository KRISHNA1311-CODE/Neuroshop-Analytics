import React from 'react';
import { UserProfile } from '../types';
import { ChevronRight, Search } from 'lucide-react';

interface Props {
  users: UserProfile[];
  selectedUserId: string | null;
  onSelectUser: (id: string) => void;
}

export const UserList: React.FC<Props> = ({ users, selectedUserId, onSelectUser }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredUsers = users.filter(u => 
    u.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.interests.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
      <div className="p-4 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-3">User Directory</h3>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search ID, Location, Interests..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Demographics</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Spend</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="p-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr 
                key={user.id} 
                onClick={() => onSelectUser(user.id)}
                className={`cursor-pointer transition-colors hover:bg-slate-50 ${selectedUserId === user.id ? 'bg-indigo-50 hover:bg-indigo-50' : ''}`}
              >
                <td className="p-4 font-medium text-indigo-600">{user.id}</td>
                <td className="p-4">
                  <div className="text-sm font-medium text-slate-900">{user.age} • {user.gender}</div>
                  <div className="text-xs text-slate-500">{user.location}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm font-medium text-slate-900">₹{user.totalSpending.toLocaleString()}</div>
                  <div className="text-xs text-slate-500">{user.productCategoryPreference}</div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    user.newsletterSubscription ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {user.newsletterSubscription ? 'Subscribed' : 'Unsubscribed'}
                  </span>
                </td>
                <td className="p-4 text-slate-400">
                  <ChevronRight size={16} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No users found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};