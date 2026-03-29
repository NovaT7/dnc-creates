import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Mail, CheckCircle, Trash2, Clock, Phone, AlertCircle } from 'lucide-react';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (id, currentStatus) => {
    if (currentStatus === 'Read') return;
    try {
      await updateDoc(doc(db, 'messages', id), {
        status: 'Read'
      });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'messages', id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-deep-brown">Messages</h1>
          <p className="text-sm text-gray-500 mt-1">{messages.length} messages received</p>
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-sm overflow-hidden">
        {messages.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Mail size={40} strokeWidth={1} className="mx-auto mb-3 text-rose-gold/40" />
            <p className="font-body">No messages received yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map(msg => (
              <div 
                key={msg.id} 
                className={`p-6 transition-colors ${msg.status === 'Unread' ? 'bg-rose-gold/5' : 'bg-white hover:bg-gray-50'}`}
                onClick={() => markAsRead(msg.id, msg.status)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${msg.status === 'Unread' ? 'bg-rose-gold/20 text-rose-gold' : 'bg-gray-100 text-gray-400'}`}>
                      {msg.status === 'Unread' ? <Mail size={16} /> : <CheckCircle size={16} />}
                    </div>
                    <div>
                      <h3 className="font-medium text-deep-brown">{msg.name}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1"><Mail size={12} /> {msg.email}</span>
                        {msg.phone && <span className="flex items-center gap-1"><Phone size={12} /> {msg.phone}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} />
                      {msg.createdAt.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirm(msg.id); }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="ml-11">
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-sm mb-3 font-medium tracking-wider uppercase">
                    {msg.type || 'General Enquiry'}
                  </span>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap font-body leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirm Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm shadow-xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle size={20} />
              <h3 className="font-medium text-lg">Delete Message?</h3>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-5 py-2 text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-5 py-2 text-sm bg-red-500 text-white rounded-sm hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
