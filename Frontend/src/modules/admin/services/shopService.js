import api from '../../../services/api';


const shopService = {
  // Upload Image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data; // expects { success: true, imageUrl: ... }
  },

  // Categories
  getCategories: async () => {
    const response = await api.get('/shop/categories');
    return response.data;
  },
  createCategory: async (data) => {
    const response = await api.post('/shop/categories', data);
    return response.data;
  },
  updateCategory: async (id, data) => {
    const response = await api.put(`/shop/categories/${id}`, data);
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await api.delete(`/shop/categories/${id}`);
    return response.data;
  },

  // Products
  getProducts: async (params) => {
    const response = await api.get('/shop/products', { params });
    return response.data;
  },
  getProduct: async (id) => {
    const response = await api.get(`/shop/products/${id}`);
    return response.data;
  },
  createProduct: async (data) => {
    const response = await api.post('/shop/products', data);
    return response.data;
  },
  updateProduct: async (id, data) => {
    const response = await api.put(`/shop/products/${id}`, data);
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await api.delete(`/shop/products/${id}`);
    return response.data;
  },

  // Orders
  getAllOrders: async (params) => {
    const response = await api.get('/shop/admin/orders', { params });
    return response.data;
  },
  updateOrderStatus: async (id, data) => {
    const response = await api.put(`/shop/admin/orders/${id}`, data);
    return response.data;
  }
};

export default shopService;
