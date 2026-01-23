import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiPackage, FiUpload, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import shopService from '../../services/shopService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // File Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    category: '',
    stock: '',
    images: [''],
    isFeatured: false,
    isActive: true
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        shopService.getProducts(),
        shopService.getCategories()
      ]);

      if (productsRes.success) setProducts(productsRes.data);
      if (categoriesRes.success) setCategories(categoriesRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Handle File Select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size too large (max 5MB)');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      // Also update formData purely for validation checks if needed, though we will replace it on submit
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.category) return toast.error('Please select a category');

      setIsUploading(true);
      let uploadedImageUrl = '';

      if (selectedFile) {
        const uploadRes = await shopService.uploadImage(selectedFile);
        if (uploadRes.success) {
          uploadedImageUrl = uploadRes.imageUrl;
        } else {
          throw new Error('Image upload failed');
        }
      }

      // If new image uploaded, it becomes the first image. 
      // If not, keep existing images[0] or empty string.
      const finalImages = [...formData.images];
      if (uploadedImageUrl) {
        finalImages[0] = uploadedImageUrl;
      } else if (!finalImages[0] && !previewUrl) {
        // If no image uploaded and no existing image, keep as empty or placeholder?
        // Allowed to be empty but recommended.
      }

      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.salePrice ? Number(formData.salePrice) : undefined,
        stock: Number(formData.stock),
        images: finalImages.filter(img => img && img.trim() !== ''),
        image: finalImages.find(img => img && img.trim() !== '') || '',
      };

      // Ensure at least one image if possible for clean DB
      if (payload.images.length === 0 && payload.image) {
        payload.images = [payload.image];
      }

      if (editingProduct) {
        await shopService.updateProduct(editingProduct._id, payload);
        toast.success('Product updated successfully');
      } else {
        await shopService.createProduct(payload);
        toast.success('Product created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchInitialData();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || 'Something went wrong');
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      salePrice: '',
      category: '',
      stock: '',
      images: [''],
      isFeatured: false,
      isActive: true
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setIsUploading(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    const existingImages = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : ['']);

    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      salePrice: product.originalPrice || '',
      category: typeof product.category === 'object' ? product.category?._id : product.category,
      stock: product.stock,
      images: existingImages,
      isFeatured: product.isFeatured,
      isActive: product.isActive
    });

    // Set preview to first image
    if (existingImages[0] && existingImages[0].startsWith('http')) {
      setPreviewUrl(existingImages[0]);
    } else {
      setPreviewUrl('');
    }
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await shopService.deleteProduct(id);
        toast.success('Product deleted successfully');
        fetchInitialData();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleAddImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const filteredProducts = products.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || (typeof prod.category === 'object' ? prod.category._id === filterCategory : prod.category === filterCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Shop Products</h1>
          <p className="text-gray-600 text-sm">Manage items available in your shop</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors shadow-md"
        >
          <FiPlus /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">Loading products...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">No products found</td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {product.images[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 uppercase">
                              <FiPackage size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{product.name}</p>
                          {product.isFeatured && (
                            <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">
                        {typeof product.category === 'object' ? product.category.name : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">₹{product.price}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${product.stock > 10 ? 'bg-green-50 text-green-600' :
                        product.stock > 0 ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                        }`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`w-2 h-2 inline-block rounded-full mr-2 ${product.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      <span className="text-sm text-gray-600">{product.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
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

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FiPlus className="rotate-45 text-2xl" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name*</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. Premium Floor Cleaner"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category*</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Quantity*</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Selling Price (₹)*</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">MRP / Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Optional (Strikethrough price)"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[80px]"
                    placeholder="Tell your customers about this product..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Product Image</label>
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
                      {previewUrl ? (
                        <div className="relative group">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="h-32 w-32 object-contain mx-auto"
                          />
                          <div
                            className="absolute top-0 right-0 -mt-2 -mr-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50 cursor-pointer border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewUrl('');
                              setFormData(prev => ({ ...prev, images: [''] }));
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

                <div className="flex items-center gap-6 md:col-span-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured Product</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Active / Published</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => !isUploading && setShowModal(false)}
                  disabled={isUploading}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-bold text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <span>{editingProduct ? 'Update Product' : 'Publish Product'}</span>
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

export default Products;
