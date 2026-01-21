"use client";
import { useState } from 'react';
import { BiPlus, BiPencil, BiCategory, BiX, BiCheck, BiCheckCircle } from 'react-icons/bi';

export default function CategoryList({ initialCategories }) {
  const [categories] = useState(initialCategories || []);
  const [showInputModal, setShowInputModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // Success feedback state

  const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/categories`;

  const handleOpenModal = (cat = null) => {
    setShowSuccess(false);
    if (cat) {
      setIsEditing(true);
      setFormData({ id: cat.id || cat._id, name: cat.name });
    } else {
      setIsEditing(false);
      setFormData({ id: null, name: '' });
    }
    setShowInputModal(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    setLoading(true);
    
    const url = isEditing ? `${API_BASE}/${formData.id}` : API_BASE;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name }),
      });

      if (res.ok) {
        setLoading(false);
        setShowInputModal(false); // Close input modal first
        setShowSuccess(true);     // Show the success "completed" popup
        
        // Wait for the user to see the success message before reloading
        setTimeout(() => {
          window.location.reload(); 
        }, 2000);
      } else {
        setLoading(false);
        const err = await res.json();
        alert(err.detail || "Error saving category");
      }
    } catch (err) {
      setLoading(false);
      alert("Connection failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* --- Professional Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
            Manage <span className="text-cyan-600">Categories</span>
          </h1>
          <p className="text-gray-500 font-medium text-sm">Dashboard / Content / Categories</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="w-full md:w-auto bg-gray-900 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl flex items-center justify-center font-bold transition-all shadow-lg active:scale-95"
        >
          <BiPlus className="mr-2 text-xl" /> Add Category
        </button>
      </div>

      {/* --- Optimized Grid (No more giant boxes) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {categories.map((cat) => (
          <div key={cat.id || cat._id} className="group bg-white border border-gray-100 p-5 rounded-2xl hover:border-cyan-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-all">
                <BiCategory size={20} />
              </div>
              <h3 className="font-bold text-gray-800 text-base truncate">{cat.name}</h3>
            </div>
            <button 
              onClick={() => handleOpenModal(cat)}
              className="w-full py-2 bg-gray-50 text-gray-500 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <BiPencil size={14} /> Edit Name
            </button>
          </div>
        ))}
      </div>

      {/* --- Input Modal --- */}
      {showInputModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
          <div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-gray-900">{isEditing ? 'Edit' : 'New'} Category</h2>
              <button onClick={() => setShowInputModal(false)} className="text-gray-400 hover:text-cyan-600"><BiX size={24} /></button>
            </div>
            <input 
              type="text"
              className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-xl outline-none focus:border-cyan-500 font-bold text-gray-800 transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              autoFocus
            />
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowInputModal(false)} className="flex-1 font-bold text-gray-400">Cancel</button>
              <button 
                onClick={handleSave} 
                disabled={loading || !formData.name.trim()}
                className="flex-[2] py-3 bg-gradient-to-r from-cyan-600 to-teal-500 text-white rounded-xl font-black shadow-lg disabled:opacity-30 transition-all flex items-center justify-center"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SUCCESS POPUP (Completed Message) --- */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[110] animate-in fade-in zoom-in duration-300">
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
          <div className="bg-white border border-cyan-100 p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(8,145,178,0.2)] text-center relative z-20 max-w-xs w-full">
            <div className="w-20 h-20 bg-cyan-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-200">
              <BiCheckCircle size={48} className="animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Completed!</h2>
            <p className="text-gray-500 font-medium">Category name has been updated successfully.</p>
            <div className="mt-6 flex flex-col items-center gap-2">
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-600 h-full animate-[progress_2s_ease-in-out]" style={{ width: '100%' }} />
              </div>
              <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest mt-2">Syncing Dashboard</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}