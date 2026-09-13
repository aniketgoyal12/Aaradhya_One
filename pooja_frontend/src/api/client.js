const BASE_URL = '/api';

/**
 * Universal API request wrapper for Aaradhya Admin
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('aaradhya_admin_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      // Clear token on authentication failure
      localStorage.removeItem('aaradhya_admin_token');
      localStorage.removeItem('aaradhya_admin_user');
      window.dispatchEvent(new Event('auth-logout'));
    }
    const error = new Error(data.error || data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  getMe: () => apiRequest('/auth/me'),

  // Products
  getProducts: () => apiRequest('/products'),
  getProductById: (id) => apiRequest(`/products/${id}`),
  createProduct: (productData) => apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  }),
  updateProduct: (id, productData) => apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData)
  }),
  deleteProduct: (id) => apiRequest(`/products/${id}`, {
    method: 'DELETE'
  }),

  // Packages
  getPackages: () => apiRequest('/packages'),
  getPackageById: (id) => apiRequest(`/packages/${id}`),
  createPackage: (packageData) => apiRequest('/packages', {
    method: 'POST',
    body: JSON.stringify(packageData)
  }),

  // Orders (Phase 2)
  calculateOrderPrice: (calcData) => apiRequest('/orders/calculate', {
    method: 'POST',
    body: JSON.stringify(calcData)
  }),
  createOrder: (orderData) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  }),
  getMyOrders: () => apiRequest('/orders/my-orders'),
  getAllOrders: () => apiRequest('/orders'),
  getOrderById: (id) => apiRequest(`/orders/${id}`),
  updateOrderStatus: (id, status) => apiRequest(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  }),
};
