"use client"
import { useState } from 'react';
import { BiSearch, BiFilterAlt, BiPencil, BiTrash } from 'react-icons/bi';

export default function UploadFetchList({ initialUploads, categories }) {
  const [list, setList] = useState(initialUploads);
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('All');

  const filterData = async () => {
    const res = await fetch(`/api/uploads?search=${query}&category=${cat}`);
    const data = await res.json();
    setList(data);
  };

  return (
    <section className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <BiSearch className="absolute left-4 top-4 text-gray-400" size={20} />
          <input className="w-full p-3.5 pl-12 bg-white border rounded-2xl outline-none focus:ring-2 focus:ring-black" 
                 placeholder="Search titles or tags..." onChange={e => setQuery(e.target.value)} />
        </div>
        <select className="p-3.5 bg-white border rounded-2xl outline-none" onChange={e => setCat(e.target.value)}>
          <option value="All">All Categories</option>
          {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
        </select>
        <button onClick={filterData} className="bg-gray-900 text-white px-8 rounded-2xl font-bold">Search</button>
      </div>

      <div className="grid gap-4">
        {list.map(item => (
          <div key={item._id} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow">
            <div>
              <h3 className="font-extrabold text-gray-900 text-lg">{item.title}</h3>
              <p className="text-xs text-gray-400 font-mono mt-1">SLUG: {item.slug} | {item.category}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100"><BiPencil /></button>
              <button className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100"><BiTrash /></button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}