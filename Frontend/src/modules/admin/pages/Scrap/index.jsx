import React, { useState, useEffect } from 'react';
import { FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
import api from '../../../../services/api';

const AdminScrapPage = () => {
  const [scraps, setScraps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchScrap();
  }, []);

  const fetchScrap = async () => {
    try {
      setLoading(true);
      const res = await api.get('/scrap/all');
      if (res.data.success) {
        setScraps(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredScraps = scraps.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Filters */}
        <div className="p-3 border-b border-gray-100 flex gap-2 overflow-x-auto bg-gray-50/50">
          {['all', 'pending', 'accepted', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${filter === f ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="px-4 py-8 text-center text-xs text-gray-500 font-medium">Loading items...</td></tr>
              ) : filteredScraps.length === 0 ? (
                <tr><td colSpan="5" className="px-4 py-8 text-center text-xs text-gray-500 font-medium">No items found</td></tr>
              ) : (
                filteredScraps.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-xs font-bold text-gray-900">{item.title}</p>
                        <p className="text-[10px] text-gray-500">{item.category} • {item.quantity}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-bold text-gray-900">{item.userId?.name}</p>
                      <p className="text-[10px] text-gray-500">{item.userId?.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      {item.vendorId ? (
                        <div>
                          <p className="text-xs font-bold text-gray-900">{item.vendorId?.name}</p>
                          <p className="text-[10px] text-gray-500">{item.vendorId?.phone}</p>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider
                        ${item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                        ${item.status === 'accepted' ? 'bg-green-100 text-green-700' : ''}
                        ${item.status === 'completed' ? 'bg-gray-100 text-gray-700' : ''}
                      `}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[10px] text-gray-500 font-medium">
                      {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminScrapPage;
