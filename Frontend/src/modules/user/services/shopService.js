import api from '../../../services/api';

const shopService = {
  // Get all orders for the current user
  getMyOrders: async () => {
    const response = await api.get('/shop/orders/my');
    return response.data;
  },

  // Get single order details
  getOrder: async (id) => {
    const response = await api.get(`/shop/orders/${id}`);
    return response.data;
  },

  // Create a new order
  createOrder: async (orderData) => {
    const response = await api.post('/shop/orders', orderData);
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/shop/categories');
    return response.data;
  },

  // Get products
  getProducts: async (params) => {
    const response = await api.get('/shop/products', { params });
    return response.data;
  },

  // Get single product
  getProduct: async (id) => {
    const response = await api.get(`/shop/products/${id}`);
    return response.data;
  }
};

export default shopService;
