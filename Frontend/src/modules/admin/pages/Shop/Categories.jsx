import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiUpload, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import shopService from '../../services/shopService';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', icon: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await shopService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size too large (max 5MB)');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', icon: '' });
    setSelectedFile(null);
    setPreviewUrl('');
    setEditingCategory(null);
    // don't close modal here if we want to reuse it for opening? 
    // Actually, let's keep resetForm as "clear and close" for submit.
    // For "Add", we need "clear and open".
    setShowModal(false);
  };

  const handleOpenAdd = () => {
    setFormData({ name: '', description: '', icon: '' });
    setSelectedFile(null);
    setPreviewUrl('');
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      let iconUrl = formData.icon;

      if (selectedFile) {
        const uploadRes = await shopService.uploadImage(selectedFile);
        if (uploadRes.success) {
          iconUrl = uploadRes.imageUrl;
        } else {
          throw new Error('Image upload failed');
        }
      }

      const dataToSubmit = { ...formData, icon: iconUrl };

      if (editingCategory) {
        await shopService.updateCategory(editingCategory._id, dataToSubmit);
        toast.success('Category updated successfully');
      } else {
        await shopService.createCategory(dataToSubmit);
        toast.success('Category created successfully');
      }
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || 'Something went wrong');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || ''
    });
    setPreviewUrl(category.icon || '');
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await shopService.deleteCategory(id);
        toast.success('Category deleted successfully');
        fetchCategories();
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Shop Categories</h1>
          <p className="text-gray-600 text-sm">Manage categories for your shop products</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FiPlus /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Icon</th>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Description</th>
                <th className="px-6 py-4 font-semibold">Products</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">Loading categories...</td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">No categories found</td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      {category.icon ? (
                        <img src={category.icon} alt={category.name} className="w-10 h-10 object-contain" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400">?</div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                    <td className="px-6 py-4 text-gray-600 truncate max-w-xs">{category.description || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-semibold">
                        {category.productsCount || 0} Products
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. Cleaning Supplies"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px]"
                  placeholder="Brief description of the category"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category Icon</label>
                <div className="mt-1 flex items-center gap-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-gray-50 transition-all text-center"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    {previewUrl || formData.icon ? (
                      <div className="relative group">
                        <img
                          src={previewUrl || formData.icon}
                          alt="Preview"
                          className="h-24 w-24 object-contain mx-auto"
                        />
                        <div
                          className="absolute top-0 right-0 -mt-2 -mr-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50 cursor-pointer border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewUrl('');
                            setFormData({ ...formData, icon: '' });
                            setSelectedFile(null);
                          }}
                        >
                          <FiX className="w-4 h-4 text-red-500" />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto transition-colors ${isUploading ? 'bg-primary-50 text-primary-500' : 'bg-gray-100 text-gray-400'}`}>
                          {isUploading ? (
                            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FiUpload className="w-6 h-6" />
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {isUploading ? (
                            <span className="text-primary-600 font-bold animate-pulse">Uploading image...</span>
                          ) : (
                            <>
                              <span className="text-primary-600 font-bold hover:underline">Click to upload</span> or drag and drop
                            </>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 font-medium">SVG, PNG, JPG (max 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => !isUploading && setShowModal(false)}
                  disabled={isUploading}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-bold text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <span>{editingCategory ? 'Update Category' : 'Create Category'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
