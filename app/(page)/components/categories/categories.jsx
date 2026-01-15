"use client"
import { useState } from 'react';
import { BiPlus, BiPencil } from 'react-icons/bi';

export default function CategoryList({ initialCategories }) {
  const [categories, setCategories] = useState(initialCategories);
  const [showInputModal, setShowInputModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:8000/api/categories";

  const handleSave = async () => {
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
        window.location.reload(); // Simplest way to sync Server Component data
      } else {
        const err = await res.json();
        alert(err.detail || "Error saving category");
      }
    } catch (err) {
      console.error("Connection failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button 
          onClick={() => { setIsEditing(false); setFormData({ name: '' }); setShowInputModal(true); }}
          className="bg-black text-white px-6 py-2 rounded-xl flex items-center"
        >
          <BiPlus className="mr-2" /> Add New
        </button>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-5 rounded-2xl border flex justify-between items-center">
            <span className="font-semibold">{cat.name}</span>
            <button 
              onClick={() => { setIsEditing(true); setFormData({ id: cat.id, name: cat.name }); setShowInputModal(true); }}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <BiPencil size={20} />
            </button>
          </div>
        ))}
      </div>

      {showInputModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-3xl p-8">
            <h2 className="text-xl font-bold mb-6">{isEditing ? 'Edit' : 'New'} Category</h2>
            <input 
              type="text"
              className="w-full border p-4 rounded-2xl mb-6 outline-none focus:ring-2 focus:ring-black"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <div className="flex gap-4">
              <button onClick={() => setShowInputModal(false)} className="flex-1 font-bold">Cancel</button>
              <button 
                onClick={handleSave} 
                disabled={loading}
                className="flex-1 py-3 bg-black text-white rounded-2xl font-bold disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}