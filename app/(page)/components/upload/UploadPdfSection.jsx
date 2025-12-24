"use client"
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function UploadPdfSection({ categories }) {
  const [file, setFile] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', desc: '', tags: '', category: 'Others', comments: true });

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected?.type !== 'application/pdf') return alert("Only PDFs allowed");
    setFile(selected);
    setShowCard(true);
  };

  const handleUpload = async () => {
    if (!form.title) return alert("Title is required");
    setLoading(true);

    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const { data: upData, error: upError } = await supabase.storage
        .from('pdfs')
        .upload(fileName, file);

      if (upError) throw upError;

      const { data: { publicUrl } } = supabase.storage.from('pdfs').getPublicUrl(fileName);

      const res = await fetch('/api/uploads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          pdfUrl: publicUrl,
          tags: form.tags.split(',').map(t => t.trim()).filter(t => t !== "")
        })
      });

      if (res.ok) window.location.reload();
      else alert("Check if your email is in ALLOWED_EMAILS in .env");
      
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="bg-white p-10 rounded-[2.5rem] border-4 border-dashed border-gray-100 text-center">
        <input type="file" id="pdf-up" hidden onChange={handleFileChange} accept=".pdf" />
        <label htmlFor="pdf-up" className="cursor-pointer bg-black text-white px-10 py-4 rounded-2xl font-bold shadow-xl inline-block hover:scale-105 transition-transform">
          Upload PDF File
        </label>
      </div>

      {showCard && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-10 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black mb-6">Document Details</h2>
            <div className="space-y-4">
              <input placeholder="Title *" className="w-full p-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-black outline-none" 
                     onChange={e => setForm({...form, title: e.target.value})} />
              <textarea placeholder="Description" className="w-full p-4 bg-gray-50 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-black outline-none" 
                        onChange={e => setForm({...form, desc: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Tags (tag1, tag2)" className="p-4 bg-gray-50 rounded-2xl ring-1 ring-gray-200 outline-none" 
                       onChange={e => setForm({...form, tags: e.target.value})} />
                <select className="p-4 bg-gray-50 rounded-2xl ring-1 ring-gray-200 outline-none" 
                        onChange={e => setForm({...form, category: e.target.value})}>
                  {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                  <option value="Others">Others</option>
                </select>
              </div>
              <div className="flex items-center gap-2 px-2 py-4">
                <input type="checkbox" className="w-5 h-5 accent-black" checked={form.comments} onChange={e => setForm({...form, comments: e.target.checked})} />
                <label className="font-bold text-gray-700">Enable Comments</label>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowCard(false)} className="flex-1 font-bold text-gray-400">Cancel</button>
              <button onClick={handleUpload} disabled={loading} className="flex-1 py-4 bg-black text-white rounded-2xl font-bold disabled:bg-gray-400">
                {loading ? 'Uploading...' : 'Publish PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}