"use client"
import { useState } from 'react';
import { BiSearch, BiPencil, BiTrash, BiX, BiLinkExternal } from 'react-icons/bi';

export default function UploadFetchList({ initialUploads, categories }) {
  const [list, setList] = useState(initialUploads);
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('All');
  
  // Edit State
  const [editItem, setEditItem] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Search Logic
  const filterData = async () => {
    const res = await fetch(`/api/uploads?search=${query}&category=${cat}`);
    const data = await res.json();
    setList(data);
  };

  // 2. Delete Logic
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this PDF?")) return;
    const res = await fetch(`/api/uploads/${id}`, { method: 'DELETE' });
    if (res.ok) setList(list.filter(item => item._id !== id));
  };

  // 3. Edit Tags Logic
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(',', '');
      if (val && !editItem.tags.includes(val)) {
        setEditItem({ ...editItem, tags: [...editItem.tags, val] });
        setTagInput('');
      }
    }
  };

  // 4. Update Logic
  const handleUpdate = async () => {
    setLoading(true);
    const res = await fetch(`/api/uploads/${editItem._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editItem),
    });
    if (res.ok) {
      const updated = await res.json();
      setList(list.map(item => item._id === updated._id ? updated : item));
      setEditItem(null);
    }
    setLoading(false);
  };

  return (
    <section className="space-y-6">
      {/* Search Bar - Responsive */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <BiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            className="w-full p-4 pl-12 bg-white border-2 border-gray-200 text-black rounded-2xl outline-none focus:border-black transition-all" 
            placeholder="Search titles or tags..." 
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && filterData()}
          />
        </div>
        <select 
          className="p-4 bg-white border-2 border-gray-200 text-black rounded-2xl outline-none focus:border-black font-bold"
          onChange={e => setCat(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
        </select>
        <button onClick={filterData} className="bg-black text-white px-8 py-4 rounded-2xl font-black hover:bg-gray-800 transition-all">
          Search
        </button>
      </div>

      {/* List Area */}
      <div className="grid gap-4">
        {list.map(item => (
          <div key={item._id} className="bg-white p-5 rounded-[2rem] border-2 border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-black transition-all shadow-sm">
            <div 
              className="cursor-pointer group flex-1" 
              onClick={() => window.open(item.pdfUrl, '_blank')}
            >
              <h3 className="font-black text-black text-xl group-hover:text-blue-600 flex items-center gap-2">
                {item.title} <BiLinkExternal className="opacity-0 group-hover:opacity-100 transition-opacity" size={16}/>
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs font-bold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{item.category}</span>
                <span className="text-xs font-mono text-gray-400 mt-1 uppercase">Slug: {item.slug}</span>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={() => setEditItem(item)}
                className="flex-1 md:flex-none p-4 bg-gray-100 text-black rounded-2xl hover:bg-black hover:text-white transition-all"
              >
                <BiPencil size={20} className="mx-auto" />
              </button>
              <button 
                onClick={() => handleDelete(item._id)}
                className="flex-1 md:flex-none p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all"
              >
                <BiTrash size={20} className="mx-auto" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal (High Contrast) */}
      {editItem && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-black">Edit Document</h2>
              <button onClick={() => setEditItem(null)} className="text-black hover:bg-gray-100 p-2 rounded-full transition-colors">
                <BiX size={30} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-black text-black block mb-2">Title</label>
                <input 
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-black font-bold outline-none focus:border-black"
                  value={editItem.title}
                  onChange={e => setEditItem({...editItem, title: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-black text-black block mb-2">Tags (Enter to add)</label>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus-within:border-black">
                  {editItem.tags.map((tag, i) => (
                    <span key={i} className="bg-black text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm font-bold">
                      {tag} <BiX className="cursor-pointer" onClick={() => setEditItem({...editItem, tags: editItem.tags.filter((_, idx) => idx !== i)})} />
                    </span>
                  ))}
                  <input 
                    className="flex-1 bg-transparent outline-none text-black font-bold p-1"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-black text-black block mb-2">Category</label>
                <select 
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-black font-bold outline-none focus:border-black"
                  value={editItem.category}
                  onChange={e => setEditItem({...editItem, category: e.target.value})}
                >
                  {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <button 
              onClick={handleUpdate}
              disabled={loading}
              className="w-full mt-8 py-4 bg-black text-white rounded-2xl font-black text-lg hover:bg-gray-800 transition-all disabled:bg-gray-400"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}