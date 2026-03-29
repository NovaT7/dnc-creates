import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../hooks/useProducts';
import { db } from '../../firebase';
import ProductForm from '../../components/admin/ProductForm';
import AdminMessages from '../../components/admin/AdminMessages';
import { Plus, Edit2, Trash2, LogOut, Package, AlertCircle, Mailbox } from 'lucide-react';

export default function AdminDashboard() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { products, loading } = useProducts();

  const [activeTab, setActiveTab] = useState('products'); // products, messages
  
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Redirect if not admin
  if (!isAdmin) {
    navigate('/admin/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleEdit = (p) => {
    setEditingProduct(p);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDelete = async (product) => {
    setDeleting(true);
    try {
      // Delete Firestore document (images are hosted on Cloudinary)
      await deleteDoc(doc(db, 'products', product.id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleteConfirm(null);
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-deep-brown text-champagne flex flex-col py-8 px-4 fixed h-full">
        <div className="mb-10">
          <p className="font-display text-2xl text-white">DNC Creates</p>
          <p className="text-xs text-champagne/50 uppercase tracking-widest mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 space-y-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${
              activeTab === 'products' ? 'bg-rose-gold/20 text-white' : 'text-champagne/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Package size={16} />
            <span className="text-sm font-body uppercase tracking-wider">Products</span>
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${
              activeTab === 'messages' ? 'bg-rose-gold/20 text-white' : 'text-champagne/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mailbox size={16} />
            <span className="text-sm font-body uppercase tracking-wider">Messages</span>
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-champagne/60 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          <span className="text-sm font-body uppercase tracking-wider">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-60 flex-1 p-8">
        {activeTab === 'products' ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-display text-3xl text-deep-brown">Products</h1>
                <p className="text-sm text-gray-500 mt-1">{products.length} items in inventory</p>
              </div>
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 bg-rose-gold text-white px-5 py-2.5 text-sm font-body uppercase tracking-wider hover:bg-rose-gold-dark transition-colors"
              >
                <Plus size={16} />
                Add New Product
              </button>
            </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold"></div>
          </div>
        ) : (
          <div className="bg-white rounded-sm shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">Product</th>
                  <th className="text-left px-4 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
                  <th className="text-left px-4 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">Price</th>
                  <th className="text-left px-4 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                  <th className="text-right px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 bg-champagne rounded-sm overflow-hidden flex-shrink-0 aspect-square">
                          {(p.imageUrl || p.image || (p.imageUrls && p.imageUrls[0])) ? (
                            <img src={p.imageUrl || p.image || (p.imageUrls && p.imageUrls[0])} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-rose-gold">
                              <Package size={20} strokeWidth={1} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-deep-brown">{p.name}</p>
                          {p.badge && (
                            <span className="text-xs bg-rose-gold/10 text-rose-gold px-2 py-0.5 rounded-full">{p.badge}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{p.category}</td>
                    <td className="px-4 py-4">
                      <span className="font-medium text-deep-brown">₹{p.price}</span>
                      {p.originalPrice && <span className="text-gray-400 text-xs line-through ml-2">₹{p.originalPrice}</span>}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${p.inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {p.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-2 text-gray-400 hover:text-rose-gold hover:bg-rose-gold/5 rounded-sm transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(p)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-sm transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Package size={40} strokeWidth={1} className="mx-auto mb-3" />
                <p className="font-body">No products yet. Add your first product!</p>
              </div>
            )}
            </div>
          )}
          </>
        ) : (
          <AdminMessages />
        )}
      </main>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleCloseForm}
          onSaved={handleCloseForm}
        />
      )}

      {/* Delete Confirm Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm shadow-xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle size={20} />
              <h3 className="font-medium text-lg">Delete Product?</h3>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
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
                disabled={deleting}
                className="px-5 py-2 text-sm bg-red-500 text-white rounded-sm hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
