"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BiPlus, BiPencil } from 'react-icons/bi';

export default function Category({ initialCategories }) {
  const [categories, setCategories] = useState(initialCategories);
  const [showInputModal, setShowInputModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);
    const url = isEditing ? `/api/categories/${formData.id}` : '/api/categories';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name }),
      });

      if (res.ok) {
        setShowConfirmModal(false);
        setShowInputModal(false);
        router.refresh();
        window.location.reload();
      }
    } catch (err) {
      console.error("Operation failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button 
          onClick={() => { setIsEditing(false); setFormData({ name: '' }); setShowInputModal(true); }}
          className="bg-gray-900 text-white px-6 py-2.5 rounded-xl flex items-center text-sm font-semibold hover:bg-black transition-all shadow-sm"
        >
          <BiPlus className="mr-2 text-lg" /> Add New Category
        </button>
      </div>

      <div className="space-y-3">
        {categories.length > 0 ? categories.map((cat) => (
          <div key={cat._id} className="bg-white p-5 rounded-2xl border border-gray-200 flex justify-between items-center hover:border-gray-300 transition-colors shadow-sm">
            <span className="font-semibold text-gray-800 text-lg">{cat.name}</span>
            <button 
              onClick={() => { setIsEditing(true); setFormData({ id: cat._id, name: cat.name }); setShowInputModal(true); }}
              className="p-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              title="Edit Category"
            >
              <BiPencil size={20} />
            </button>
          </div>
        )) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500">No categories found. Add your first one above.</p>
          </div>
        )}
      </div>

      {/* MODAL: INPUT CARD */}
      {showInputModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl border border-gray-100">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6">
              {isEditing ? 'Edit Category' : 'New Category'}
            </h2>
            <div className="space-y-2 mb-8">
              <label className="text-sm font-bold text-gray-700 ml-1">Category Name</label>
              <input 
                type="text"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-gray-900 font-medium"
                placeholder="e.g. Graphic Design"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowInputModal(false)} 
                className="flex-1 py-3.5 text-gray-600 font-bold hover:bg-gray-50 rounded-2xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowConfirmModal(true)}
                disabled={!formData.name.trim()}
                className="flex-1 py-3.5 bg-gray-900 text-white rounded-2xl font-bold disabled:opacity-30 hover:bg-black transition-all"
              >
                {isEditing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRMATION */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BiPlus className={`text-2xl ${isEditing ? 'text-blue-600' : 'text-green-600'}`} />
            </div>
            <h3 className="font-black text-xl text-gray-900">Are you sure?</h3>
            <p className="text-gray-500 font-medium mt-2 mb-8 px-4">
              You are about to {isEditing ? 'update' : 'create'} <span className="text-gray-900 font-bold italic">"{formData.name}"</span>
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleSave} 
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Yes, Proceed'}
              </button>
              <button 
                onClick={() => setShowConfirmModal(false)} 
                className="w-full py-3 text-gray-500 font-bold hover:text-gray-800 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}