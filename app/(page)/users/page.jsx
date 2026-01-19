"use client"

import { useEffect, useState } from "react"
import { Users, Mail, Trophy, FileText, Calendar, ShieldCheck, Search } from "lucide-react"

export default function AdminUsersPage() {
  // Initialize as empty array to prevent filter error on first render
  const [users, setUsers] = useState([]) 
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/admin/all-users")
        if (!res.ok) throw new Error("Backend error")
        const data = await res.json()
        
        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setUsers(data)
        } else {
          setUsers([])
        }
      } catch (err) {
        console.error("Fetch failed:", err)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  // Defensive filtering: check if users is an array
  const filteredUsers = Array.isArray(users) 
    ? users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []

  if (loading) return <div className="p-20 text-center text-slate-500 animate-pulse">Loading database...</div>

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
              Userlist of Mentora Learning Platform
            </h1>
           
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Filter by name or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">Member</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 text-center">Points</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 text-center">Notes</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 text-center">Badges</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                        {user.image ? (
                          <img src={user.image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <span className="text-blue-600 font-bold">{user.name?.[0]?.toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.name}</p>
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-300" /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-black border border-blue-100">
                      {user.contributionPoints || 0}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center font-semibold text-slate-600">
                    {user.notesCount || 0}
                  </td>
                  <td className="px-6 py-5 text-center font-semibold text-slate-600">
                    {user.badgesCount || 0}
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-400 font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-300" />
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "No Date"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="p-20 text-center text-slate-400 italic bg-slate-50/30">
              No matching users found in database.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}