import React, { useState, useRef } from 'react';
import { collection, doc, addDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { CATEGORIES } from '../../data/products';
import { X, ImageIcon, Plus } from 'lucide-react';

const CLOUDINARY_CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`;

const PRODUCT_CATEGORIES = CATEGORIES.filter(c => c !== 'All');

const emptyForm = {
  name: '',
  category: PRODUCT_CATEGORIES[0],
  price: '',
  originalPrice: '',
  badge: '',
  description: '',
  inStock: true,
  featured: false,
};

function buildExistingEntries(product) {
  const urls = product?.imageUrls || (product?.imageUrl ? [product.imageUrl] : []);
  return urls.map(url => ({ file: null, preview: url, existing: true }));
}

export default function ProductForm({ product, onClose, onSaved }) {
  const isEdit = !!product;
  const [form, setForm] = useState(isEdit ? {
    name: product.name || '',
    category: product.category || PRODUCT_CATEGORIES[0],
    price: product.price || '',
    originalPrice: product.originalPrice || '',
    badge: product.badge || '',
    description: product.description || '',
    inStock: product.inStock ?? true,
    featured: product.featured ?? false,
  } : emptyForm);

  const [images, setImages] = useState(isEdit ? buildExistingEntries(product) : []);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef();

  const handleFieldChange = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const addFiles = (files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'));
    const entries = valid.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      existing: false,
    }));
    setImages(prev => [...prev, ...entries]);
  };

  const handleFileInput = (e) => {
    addFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    setImages(prev => {
      const updated = [...prev];
      if (!updated[index].existing) URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  // Upload a single new image to Cloudinary via XMLHttpRequest (for progress)
  const uploadToCloudinary = (entry, index) => {
    return new Promise((resolve, reject) => {
      if (entry.existing) {
        resolve(entry.preview); // Already a URL, keep it
        return;
      }
      const formData = new FormData();
      formData.append('file', entry.file);
      formData.append('upload_preset', CLOUDINARY_PRESET);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', UPLOAD_URL);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(prev => ({ ...prev, [index]: pct }));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          resolve(data.secure_url);
        } else {
          reject(new Error(`Cloudinary upload failed: ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.send(formData);
    });
  };

  const uploadAllImages = async () => {
    return Promise.all(images.map((entry, i) => uploadToCloudinary(entry, i)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const hasNewImages = images.some(img => !img.existing);
    setUploading(hasNewImages);

    try {
      const imageUrls = await uploadAllImages();

      const productData = {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        badge: form.badge || null,
        description: form.description,
        inStock: form.inStock,
        featured: form.featured,
        imageUrls,
        imageUrl: imageUrls[0] || null, // legacy compat
      };

      if (isEdit) {
        await setDoc(doc(db, 'products', product.id), {
          ...productData,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: serverTimestamp(),
        });
      }

      onSaved?.();
      onClose?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const inputClass = "w-full bg-transparent border border-gray-200 p-2.5 text-sm focus:outline-none focus:border-rose-gold transition-colors";
  const labelClass = "block text-xs font-medium uppercase tracking-wider text-gray-600 mb-1";

  const totalNewImages = images.filter(img => !img.existing).length;
  const overallProgress = totalNewImages > 0
    ? Math.round(
        Object.entries(uploadProgress)
          .filter(([i]) => !images[i]?.existing)
          .reduce((sum, [, v]) => sum + v, 0) / totalNewImages
      )
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
          <h3 className="font-display text-2xl text-deep-brown">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 text-sm rounded-sm border border-red-100">{error}</div>
          )}

          {/* Image Upload */}
          <div>
            <label className={labelClass}>Product Images</label>

            {/* Drop zone */}
            <div
              className={`border-2 border-dashed rounded-sm p-4 text-center cursor-pointer transition-colors mb-3 ${dragging ? 'border-rose-gold bg-rose-gold/5' : 'border-gray-200 hover:border-rose-gold'}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="py-4 flex flex-col items-center text-gray-400">
                <ImageIcon size={32} strokeWidth={1} className="mb-2" />
                <p className="text-sm">Drag & drop images or <span className="text-rose-gold">browse</span></p>
                <p className="text-xs mt-1">PNG, JPG up to 5MB each — multiple allowed</p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileInput}
              />
            </div>

            {/* Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative group rounded-sm overflow-hidden border border-gray-100">
                    <img src={img.preview} alt={`Product ${i + 1}`} className="w-full h-28 object-cover" />
                    {/* Per-image upload bar */}
                    {uploading && !img.existing && uploadProgress[i] !== undefined && uploadProgress[i] < 100 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                        <div className="h-1 bg-rose-gold transition-all" style={{ width: `${uploadProgress[i]}%` }} />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X size={12} />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 text-[10px] bg-rose-gold text-white px-1.5 py-0.5 rounded-sm">
                        Primary
                      </span>
                    )}
                  </div>
                ))}

                {/* Add more */}
                <div
                  className="h-28 border-2 border-dashed border-gray-200 hover:border-rose-gold rounded-sm flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-rose-gold transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Plus size={20} strokeWidth={1.5} />
                  <span className="text-xs mt-1">Add more</span>
                </div>
              </div>
            )}

            {/* Overall progress bar */}
            {uploading && (
              <div className="mt-2">
                <div className="h-1.5 bg-gray-100 rounded-full">
                  <div className="h-1.5 bg-rose-gold rounded-full transition-all" style={{ width: `${overallProgress}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1 text-center">
                  Uploading to Cloudinary… {overallProgress}%
                </p>
              </div>
            )}
          </div>

          {/* Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelClass}>Product Name</label>
              <input type="text" required className={inputClass} value={form.name}
                onChange={e => handleFieldChange('name', e.target.value)} placeholder="Rose Gold Diamond Ring" />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select className={inputClass} value={form.category}
                onChange={e => handleFieldChange('category', e.target.value)}>
                {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Badge (optional)</label>
              <input type="text" className={inputClass} value={form.badge}
                onChange={e => handleFieldChange('badge', e.target.value)} placeholder="Bestseller, New..." />
            </div>
            <div>
              <label className={labelClass}>Price (₹)</label>
              <input type="number" required min="0" className={inputClass} value={form.price}
                onChange={e => handleFieldChange('price', e.target.value)} placeholder="1299" />
            </div>
            <div>
              <label className={labelClass}>Original Price (₹, optional)</label>
              <input type="number" min="0" className={inputClass} value={form.originalPrice}
                onChange={e => handleFieldChange('originalPrice', e.target.value)} placeholder="1599" />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Description</label>
              <textarea required rows={3} className={inputClass + ' resize-none'} value={form.description}
                onChange={e => handleFieldChange('description', e.target.value)} placeholder="Product description..." />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className={`relative w-11 h-6 rounded-full transition-colors ${form.inStock ? 'bg-rose-gold' : 'bg-gray-200'}`}
                onClick={() => handleFieldChange('inStock', !form.inStock)}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.inStock ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm font-body text-gray-700">In Stock</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className={`relative w-11 h-6 rounded-full transition-colors ${form.featured ? 'bg-rose-gold' : 'bg-gray-200'}`}
                onClick={() => handleFieldChange('featured', !form.featured)}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.featured ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm font-body text-gray-700">Featured</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="px-6 py-2.5 text-sm font-body border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-8 py-2.5 text-sm font-body bg-rose-gold text-white hover:bg-rose-gold-dark transition-colors disabled:opacity-50 flex items-center gap-2">
              {saving ? (
                <><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  {uploading ? `Uploading… ${overallProgress}%` : 'Saving...'}</>
              ) : (isEdit ? 'Save Changes' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
