import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Edit, Trash2, Plus, Loader2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { API_URL } from '@/lib/api';

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('courses');
  const [usersList, setUsersList] = useState([]);
  
  // Stare pentru a deschide formularul de Editare / Adăugare
  const [editingCourse, setEditingCourse] = useState(null);

  // 1. Tragem cursurile
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/courses`);
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Eroare:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
  try {
    const res = await fetch(`${API_URL}/admin/users`);
    const data = await res.json();
    setUsersList(data);
  } catch (error) {
    console.error("Eroare la preluarea utilizatorilor:", error);
  }
};

  useEffect(() => {
    fetchCourses();
  }, []);

  // 2. Ștergerea unui curs
  const handleDelete = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi acest curs? Acțiunea este ireversibilă!")) return;
    
    try {
      await fetch(`${API_URL}/courses/${id}`, { method: 'DELETE' });
      setCourses(courses.filter(c => c._id !== id));
    } catch (error) {
      console.error("Eroare la ștergere:", error);
    }
  };

  // 3. Salvarea modificărilor (Create sau Update)
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
      
      setEditingCourse(null); // Închidem formularul
      fetchCourses(); // Reîncărcăm lista ca să vedem modificările
    } catch (error) {
      console.error("Eroare la salvare:", error);
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center bg-[#0f0f0f]"><Loader2 className="w-10 h-10 animate-spin text-yellow-500" /></div>;

  return (
    <>
      <Helmet><title>Admin Panel - NovaTrader</title></Helmet>
      <div className="min-h-screen bg-[#0f0f0f] text-white pt-24 px-4 pb-20">
        <div className="container mx-auto">
          
          <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
            <h1 className="text-3xl font-bold gold-text">Yönetici Paneli (Admin)</h1>
            <Button 
              onClick={() => setEditingCourse({ title: '', price: 0, description: '', isAvailable: true, thumbnail: '', lessons: [] })}
              className="gold-gradient text-black font-bold"
            >
              <Plus className="w-5 h-5 mr-1" /> Yeni Kurs Ekle (Adaugă Curs)
            </Button>
          </div>

          {/* DACĂ FORMULARUL ESTE DESCHIS */}
          {editingCourse ? (
            <div className="bg-[#121212] border border-yellow-600/30 p-6 rounded-xl mb-8">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold text-yellow-500">
                  {editingCourse._id ? 'Kursu Düzenle (Editează)' : 'Yeni Kurs (Curs Nou)'}
                </h2>
                <button onClick={() => setEditingCourse(null)} className="text-gray-400 hover:text-white"><X /></button>
              </div>
              
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Titlu Curs</label>
                  <input type="text" value={editingCourse.title} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} required className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-2 text-white focus:border-yellow-500" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Preț (€)</label>
                    <input type="number" value={editingCourse.price} onChange={e => setEditingCourse({...editingCourse, price: Number(e.target.value)})} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Link Poză (Thumbnail)</label>
                    <input type="text" value={editingCourse.thumbnail} onChange={e => setEditingCourse({...editingCourse, thumbnail: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-2 text-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">Descriere</label>
                  <textarea value={editingCourse.description} onChange={e => setEditingCourse({...editingCourse, description: e.target.value})} className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-2 text-white h-20" />
                </div>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={editingCourse.isAvailable} onChange={e => setEditingCourse({...editingCourse, isAvailable: e.target.checked})} className="w-4 h-4 accent-yellow-500" />
                  <span className="text-gray-300">Cursul este activ (Gata de vânzare)</span>
                </label>

                {/* Butoane Salvare */}
                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-800">
                  <Button type="button" onClick={() => setEditingCourse(null)} variant="outline" className="border-gray-600 text-gray-300">İptal (Anulează)</Button>
                  <Button type="submit" className="gold-gradient text-black font-bold"><Save className="w-4 h-4 mr-2" /> Kaydet (Salvează)</Button>
                </div>
              </form>
            </div>
          ) : (
            
            /* LISTA DE CURSURI CÂND FORMULARUL E ÎNCHIS */
            <div className="grid gap-4">
              {courses.map(course => (
                <div key={course._id} className="bg-[#121212] border border-gray-800 rounded-lg p-4 flex items-center justify-between hover:border-yellow-600/30 transition-colors">
                  <div className="flex items-center space-x-4">
                    <img src={course.thumbnail} alt="" className="w-16 h-12 object-cover rounded border border-gray-700" />
                    <div>
                      <h3 className="font-bold text-white">{course.title}</h3>
                      <p className="text-sm text-gray-500">{course.price}€ • {course.lessons?.length || 0} Ders • {course.isAvailable ? <span className="text-green-500">Activ</span> : <span className="text-orange-500">Coming Soon</span>}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={() => setEditingCourse(course)} className="bg-blue-600 hover:bg-blue-700 text-white px-3"><Edit className="w-4 h-4" /></Button>
                    <Button onClick={() => handleDelete(course._id)} className="bg-red-600 hover:bg-red-700 text-white px-3"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default AdminDashboard;