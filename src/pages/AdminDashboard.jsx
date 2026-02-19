import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Edit, Trash2, Plus, Loader2, Save, X, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { API_URL } from '@/lib/api';

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' sau 'users'
  const [editingCourse, setEditingCourse] = useState(null);

  // 1. Tragem datele de la server (Cursuri + Utilizatori)
  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/courses`),
        fetch(`${API_URL}/admin/users`)
      ]);
      const coursesData = await coursesRes.json();
      const usersData = await usersRes.json();
      
      setCourses(coursesData);
      setUsersList(usersData);
    } catch (error) {
      console.error("Eroare la preluarea datelor:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Logica pentru Cursuri
  const handleDelete = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi acest curs? Acțiunea este ireversibilă!")) return;
    try {
      await fetch(`${API_URL}/courses/${id}`, { method: 'DELETE' });
      setCourses(courses.filter(c => c._id !== id));
    } catch (error) { console.error("Eroare la ștergere:", error); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const isNew = !editingCourse._id;
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? `${API_URL}/courses` : `${API_URL}/courses/${editingCourse._id}`;

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCourse)
      });
      setEditingCourse(null);
      fetchData();
    } catch (error) { console.error("Eroare la salvare:", error); }
  };

  // 3. Logica pentru Utilizatori (Schimbare Rol)
  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Vrei să schimbi rolul acestui utilizator în ${newRole.toUpperCase()}?`)) return;

    try {
      await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      fetchData(); // Reîncărcăm lista pentru a vedea modificarea
    } catch (error) {
      console.error("Eroare la schimbarea rolului:", error);
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center bg-[#0f0f0f]"><Loader2 className="w-10 h-10 animate-spin text-yellow-500" /></div>;

  return (
    <>
      <Helmet><title>Admin Panel - NovaTrader</title></Helmet>
      <div className="min-h-screen bg-[#0f0f0f] text-white pt-24 px-4 pb-20">
        <div className="container mx-auto">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
            <h1 className="text-3xl font-bold gold-text">Yönetici Paneli (Admin)</h1>
            {activeTab === 'courses' && (
              <Button 
                onClick={() => setEditingCourse({ title: '', price: 0, description: '', isAvailable: true, thumbnail: '', lessons: [] })}
                className="gold-gradient text-black font-bold"
              >
                <Plus className="w-5 h-5 mr-1" /> Yeni Kurs Ekle
              </Button>
            )}
          </div>

          {/* Navigare Tab-uri */}
          <div className="flex space-x-4 mb-8">
            <button 
              onClick={() => setActiveTab('courses')}
              className={`px-6 py-2 rounded-full font-bold transition ${activeTab === 'courses' ? 'gold-gradient text-black' : 'bg-[#121212] border border-gray-800 text-gray-400 hover:text-white'}`}
            >
              Kurslar (Cursuri)
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-6 py-2 rounded-full font-bold transition ${activeTab === 'users' ? 'gold-gradient text-black' : 'bg-[#121212] border border-gray-800 text-gray-400 hover:text-white'}`}
            >
              Kullanıcılar (Utilizatori)
            </button>
          </div>

          {/* Conținut Tab-uri */}
          {activeTab === 'courses' ? (
            /* TAB CURSURI */
            editingCourse ? (
              // FORMULAR ADAUGARE/EDITARE CURS
              <div className="bg-[#121212] border border-yellow-600/30 p-6 rounded-xl mb-8">
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-bold text-yellow-500">{editingCourse._id ? 'Kursu Düzenle' : 'Yeni Kurs'}</h2>
                  <button onClick={() => setEditingCourse(null)} className="text-gray-400 hover:text-white"><X /></button>
                </div>
                <form onSubmit={handleSave} className="space-y-4">
                  {/* Câmpurile standard */}
                  <div><label className="block text-gray-400 text-sm mb-1">Titlu Curs</label><input type="text" value={editingCourse.title} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} required className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-2 text-white focus:border-yellow-500" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-gray-400 text-sm mb-1">Preț (€)</label><input type="number" value={editingCourse.price} onChange={e => setEditingCourse({...editingCourse, price: Number(e.target.value)})} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-2 text-white" /></div>
                    <div><label className="block text-gray-400 text-sm mb-1">Link Poză</label><input type="text" value={editingCourse.thumbnail} onChange={e => setEditingCourse({...editingCourse, thumbnail: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-2 text-white" /></div>
                  </div>
                  <div><label className="block text-gray-400 text-sm mb-1">Descriere</label><textarea value={editingCourse.description} onChange={e => setEditingCourse({...editingCourse, description: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-2 text-white h-20" /></div>
                  <label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" checked={editingCourse.isAvailable} onChange={e => setEditingCourse({...editingCourse, isAvailable: e.target.checked})} className="w-4 h-4 accent-yellow-500" /><span className="text-gray-300">Cursul este activ</span></label>
                  
                  {/* --- AICI ESTE SECTIUNEA NOUA PENTRU LECTII --- */}
                  <div className="mt-8 border-t border-gray-800 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-white">Dersler (Lecții Video)</h3>
                      <Button 
                        type="button" 
                        onClick={() => {
                          const currentLessons = editingCourse.lessons || [];
                          setEditingCourse({
                            ...editingCourse,
                            lessons: [...currentLessons, { title: '', videoUrl: '', duration: '' }]
                          });
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 h-8 text-sm flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Ders Ekle
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {(!editingCourse.lessons || editingCourse.lessons.length === 0) ? (
                        <p className="text-gray-500 text-sm italic">Henüz ders eklenmemiş. (Nu a fost adăugată nicio lecție)</p>
                      ) : (
                        editingCourse.lessons.map((lesson, index) => (
                          <div key={index} className="flex gap-2 items-start bg-[#1a1a1a] p-3 rounded-lg border border-gray-700">
                            <div className="flex-grow space-y-2">
                              {/* Titlu Lectie */}
                              <input 
                                type="text" 
                                placeholder="Ders Başlığı (ex: Bölüm 1: Borsa Nedir?)" 
                                value={lesson.title} 
                                onChange={(e) => {
                                  const newLessons = [...editingCourse.lessons];
                                  newLessons[index].title = e.target.value;
                                  setEditingCourse({...editingCourse, lessons: newLessons});
                                }} 
                                className="w-full bg-[#121212] border border-gray-600 rounded p-2 text-white text-sm focus:border-yellow-500" 
                                required 
                              />
                              <div className="flex gap-2">
                                {/* Vimeo URL */}
                                <input 
                                  type="text" 
                                  placeholder="Vimeo URL (ex: https://player.vimeo.com/video/1163897386)" 
                                  value={lesson.videoUrl} 
                                  onChange={(e) => {
                                    const newLessons = [...editingCourse.lessons];
                                    newLessons[index].videoUrl = e.target.value;
                                    setEditingCourse({...editingCourse, lessons: newLessons});
                                  }} 
                                  className="flex-grow bg-[#121212] border border-gray-600 rounded p-2 text-white text-sm focus:border-yellow-500" 
                                  required 
                                />
                                {/* Durata */}
                                <input 
                                  type="text" 
                                  placeholder="Süre (ex: 03:47)" 
                                  value={lesson.duration} 
                                  onChange={(e) => {
                                    const newLessons = [...editingCourse.lessons];
                                    newLessons[index].duration = e.target.value;
                                    setEditingCourse({...editingCourse, lessons: newLessons});
                                  }} 
                                  className="w-32 bg-[#121212] border border-gray-600 rounded p-2 text-white text-sm focus:border-yellow-500" 
                                />
                              </div>
                            </div>
                            {/* Buton Sterge Lectie */}
                            <Button 
                              type="button" 
                              onClick={() => {
                                const newLessons = editingCourse.lessons.filter((_, i) => i !== index);
                                setEditingCourse({...editingCourse, lessons: newLessons});
                              }}
                              className="bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white p-2 h-auto"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  {/* --- FINAL SECTIUNE LECTII --- */}

                  <div className="flex justify-end space-x-4 pt-6 mt-4 border-t border-gray-800">
                    <Button type="button" onClick={() => setEditingCourse(null)} variant="outline" className="border-gray-600 text-gray-300">İptal</Button>
                    <Button type="submit" className="gold-gradient text-black font-bold"><Save className="w-4 h-4 mr-2" /> Kaydet</Button>
                  </div>
                </form>
              </div>
            ) : (
              // LISTA CURSURI
              <div className="grid gap-4">
                {courses.map(course => (
                  <div key={course._id} className="bg-[#121212] border border-gray-800 rounded-lg p-4 flex items-center justify-between hover:border-yellow-600/30 transition-colors">
                    <div className="flex items-center space-x-4">
                      <img src={course.thumbnail} alt="" className="w-16 h-12 object-cover rounded border border-gray-700" />
                      <div>
                        <h3 className="font-bold text-white">{course.title}</h3>
                        <p className="text-sm text-gray-500">
                          {course.price}€ • {course.isAvailable ? <span className="text-green-500">Activ</span> : <span className="text-orange-500">Inactiv</span>} • {course.lessons?.length || 0} Ders
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => setEditingCourse(course)} className="bg-blue-600 hover:bg-blue-700 text-white px-3"><Edit className="w-4 h-4" /></Button>
                      <Button onClick={() => handleDelete(course._id)} className="bg-red-600 hover:bg-red-700 text-white px-3"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* TAB UTILIZATORI */
            <div className="bg-[#121212] border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-black/40 border-b border-gray-800 text-gray-400">
                  <tr>
                    <th className="p-4">Nume / Email</th>
                    <th className="p-4 text-center">Status Telegram</th>
                    <th className="p-4">Rol</th>
                    <th className="p-4 text-right">Acțiune</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {usersList.map(u => (
                    <tr key={u._id} className="hover:bg-white/5 transition">
                      <td className="p-4">
                        <p className="font-bold text-white">{u.fullName}</p>
                        <p className="text-gray-500 text-xs">{u.email}</p>
                      </td>
                      <td className="p-4 text-center">
                        {u.isVerified ? (
                          <span className="inline-flex items-center text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded">
                            <ShieldCheck className="w-3 h-3 mr-1" /> Verificat
                          </span>
                        ) : (
                          <span className="text-gray-600 text-xs font-bold">În așteptare</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => toggleRole(u._id, u.role)}
                          className="text-xs font-bold text-gray-300 hover:text-yellow-500 border border-gray-700 hover:border-yellow-500 px-3 py-1.5 rounded transition"
                        >
                          Schimbă în {u.role === 'admin' ? 'User' : 'Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {usersList.length === 0 && <div className="p-8 text-center text-gray-500">Nu s-a găsit niciun utilizator.</div>}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default AdminDashboard;