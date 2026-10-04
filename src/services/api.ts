import type { Product, Review, Order, UserAccount, StoreSettings, DashboardStats } from '../types/index.ts';

const BASE_URL = '';

export async function fetchStoreSettings(): Promise<{ settings: StoreSettings; categories: string[] }> {
  const res = await fetch(`${BASE_URL}/api/settings`);
  if (!res.ok) throw new Error('Failed to load store settings');
  return res.json();
}

export async function updateStoreSettings(settings: Partial<StoreSettings>, token: string): Promise<StoreSettings> {
  const res = await fetch(`${BASE_URL}/api/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(settings)
  });
  if (!res.ok) throw new Error('Failed to update store settings');
  const data = await res.json();
  return data.settings;
}

export async function fetchProducts(params: {
  category?: string;
  search?: string;
  sort?: string;
  featured?: boolean;
  popular?: boolean;
  isNew?: boolean;
  limit?: number;
} = {}): Promise<Product[]> {
  const url = new URL(`${BASE_URL}/api/products`, window.location.origin);
  if (params.category) url.searchParams.set('category', params.category);
  if (params.search) url.searchParams.set('search', params.search);
  if (params.sort) url.searchParams.set('sort', params.sort);
  if (params.featured) url.searchParams.set('featured', 'true');
  if (params.popular) url.searchParams.set('popular', 'true');
  if (params.isNew) url.searchParams.set('isNew', 'true');
  if (params.limit) url.searchParams.set('limit', String(params.limit));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  return data.products;
}

export async function fetchAdminProducts(token: string): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/api/admin/products`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch admin products');
  const data = await res.json();
  return data.products;
}

export async function fetchProduct(id: string): Promise<{ product: Product; reviews: Review[] }> {
  const res = await fetch(`${BASE_URL}/api/products/${id}`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
}

export async function createProduct(productData: Partial<Product>, token: string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  if (!res.ok) throw new Error('Failed to create product');
  const data = await res.json();
  return data.product;
}

export async function updateProduct(id: string, productData: Partial<Product>, token: string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  if (!res.ok) throw new Error('Failed to update product');
  const data = await res.json();
  return data.product;
}

export async function deleteProduct(id: string, token: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete product');
  return true;
}

export async function submitReview(reviewData: {
  productId: string;
  userName: string;
  userCity: string;
  rating: number;
  comment: string;
}): Promise<Review> {
  const res = await fetch(`${BASE_URL}/api/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData)
  });
  if (!res.ok) throw new Error('Failed to submit review');
  const data = await res.json();
  return data.review;
}

export async function fetchAdminReviews(token: string): Promise<Review[]> {
  const res = await fetch(`${BASE_URL}/api/admin/reviews`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch reviews');
  const data = await res.json();
  return data.reviews;
}

export async function updateReviewStatus(id: string, status: 'approved' | 'rejected', token: string): Promise<Review> {
  const res = await fetch(`${BASE_URL}/api/admin/reviews/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update review status');
  const data = await res.json();
  return data.review;
}

export async function deleteReview(id: string, token: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/api/admin/reviews/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete review');
  return true;
}

export async function createOrder(orderPayload: any): Promise<Order> {
  const res = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload)
  });
  if (!res.ok) throw new Error('Failed to create order');
  const data = await res.json();
  return data.order;
}

export async function submitPaymentProof(orderId: string, proof: { transactionId: string; paymentScreenshotUrl?: string }): Promise<Order> {
  const res = await fetch(`${BASE_URL}/api/orders/${orderId}/payment-proof`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(proof)
  });
  if (!res.ok) throw new Error('Failed to submit payment confirmation');
  const data = await res.json();
  return data.order;
}

export async function uploadPaymentProof(base64Data: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/upload-payment-proof`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: base64Data })
  });
  if (!res.ok) throw new Error('Failed to upload payment proof');
  const data = await res.json();
  return data.url;
}

export async function fetchCustomerOrders(params: { customerId?: string; customerEmail?: string; customerPhone?: string }): Promise<Order[]> {
  const url = new URL(`${BASE_URL}/api/orders`, window.location.origin);
  if (params.customerId) url.searchParams.set('customerId', params.customerId);
  if (params.customerEmail) url.searchParams.set('customerEmail', params.customerEmail);
  if (params.customerPhone) url.searchParams.set('customerPhone', params.customerPhone);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to load orders');
  const data = await res.json();
  return data.orders;
}

export async function fetchAdminOrders(token: string, filter?: { status?: string; search?: string }): Promise<Order[]> {
  const url = new URL(`${BASE_URL}/api/admin/orders`, window.location.origin);
  if (filter?.status && filter.status !== 'all') url.searchParams.set('status', filter.status);
  if (filter?.search) url.searchParams.set('search', filter.search);

  const res = await fetch(url.toString(), {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch admin orders');
  const data = await res.json();
  return data.orders;
}

export async function updateOrderStatus(id: string, updates: { orderStatus?: string; paymentStatus?: string }, token: string): Promise<Order> {
  const res = await fetch(`${BASE_URL}/api/admin/orders/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update order');
  const data = await res.json();
  return data.order;
}

export async function fetchAdminStats(token: string): Promise<DashboardStats> {
  const res = await fetch(`${BASE_URL}/api/admin/stats`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch admin stats');
  const data = await res.json();
  return data.stats;
}

export async function adminLogin(identifier: string, password: string): Promise<{ token: string; user: any }> {
  const res = await fetch(`${BASE_URL}/api/auth/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Invalid email or password');
  }
  return res.json();
}

export async function verifyAdminSession(token: string): Promise<{ valid: boolean; user: any }> {
  const res = await fetch(`${BASE_URL}/api/auth/admin-session`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Admin session expired or invalid');
  return res.json();
}

export async function adminLogout(token: string): Promise<boolean> {
  try {
    await fetch(`${BASE_URL}/api/auth/admin-logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  } catch {}
  return true;
}

export async function getAdminStatus(): Promise<{ isConfigured: boolean; username: string }> {
  const res = await fetch(`${BASE_URL}/api/auth/admin-status`);
  if (!res.ok) throw new Error('Failed to fetch admin status');
  return res.json();
}

export async function adminSetup(data: { username: string; email: string; password: string }): Promise<{ token: string; user: any }> {
  const res = await fetch(`${BASE_URL}/api/auth/admin-setup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Admin setup failed');
  }
  return res.json();
}

export async function customerLogin(email: string, password: string): Promise<{ token: string; user: UserAccount }> {
  const res = await fetch(`${BASE_URL}/api/auth/customer-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Login failed');
  }
  return res.json();
}

export async function customerRegister(userData: any): Promise<{ token: string; user: UserAccount }> {
  const res = await fetch(`${BASE_URL}/api/auth/customer-register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Registration failed');
  }
  return res.json();
}

export async function verifySession(token: string): Promise<{ user: UserAccount }> {
  const res = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Session expired');
  return res.json();
}

export async function updateCustomerProfile(data: Partial<UserAccount>, token: string): Promise<UserAccount> {
  const res = await fetch(`${BASE_URL}/api/auth/customer-profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update profile');
  const resData = await res.json();
  return resData.user;
}

export async function uploadImage(base64Data: string, token: string, filename?: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ data: base64Data, filename })
  });
  if (!res.ok) throw new Error('Failed to upload image');
  const data = await res.json();
  return data.url;
}

export async function updateAdminCredentials(credentials: { newUsername?: string; newEmail?: string; newPassword?: string }, token: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/api/auth/admin-credentials`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(credentials)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update admin credentials');
  }
  return res.json();
}

export async function sendAiChatMessage(payload: {
  message: string;
  history?: { role: string; text: string }[];
  currentProductId?: string;
}): Promise<{ reply: string; recommendedProductIds: string[] }> {
  const res = await fetch(`${BASE_URL}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to get AI response');
  return res.json();
}

