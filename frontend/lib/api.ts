// API service functions for SSL monitoring

// Use HTTP for local development to avoid SSL certificate issues
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Only access localStorage on the client side
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return headers;
}

// Helper function to handle API responses
async function handleApiResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `HTTP error! status: ${response.status}`;
    
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorData.title || errorMessage;
    } catch {
      // If not JSON, use the text as error message
      errorMessage = errorText || errorMessage;
    }
    
    // If unauthorized, redirect to login
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login?message=Session expired. Please log in again.';
      }
      throw new Error('Authentication required. Please log in.');
    }
    
    throw new Error(errorMessage);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response.text();
}

// Sites API
export const sitesApi = {
  async getAllSites() {
    try {
      const response = await fetch(`${API_BASE_URL}/sites`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error in getAllSites:', error);
      throw new Error('Failed to fetch sites. Please ensure you are logged in and the backend server is running.');
    }
  },

  async getSite(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/sites/${id}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error in getSite:', error);
      throw new Error('Failed to fetch site');
    }
  },

  async createSite(siteData: { name: string; url: string }) {
    try {
      const response = await fetch(`${API_BASE_URL}/sites`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(siteData),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error in createSite:', error);
      throw new Error('Failed to create site');
    }
  },

  async updateSite(id: number, siteData: { name: string; url: string; isActive: boolean }) {
    try {
      const response = await fetch(`${API_BASE_URL}/sites/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(siteData),
      });
      await handleApiResponse(response);
      return true;
    } catch (error) {
      console.error('Error in updateSite:', error);
      throw new Error('Failed to update site');
    }
  },

  async deleteSite(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/sites/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      await handleApiResponse(response);
      return true;
    } catch (error) {
      console.error('Error in deleteSite:', error);
      throw new Error('Failed to delete site');
    }
  },
};

// SSL API
export const sslApi = {
  async getAllSSLCertificates() {
    try {
      const response = await fetch(`${API_BASE_URL}/ssl`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error in getAllSSLCertificates:', error);
      throw new Error('Failed to fetch SSL certificates');
    }
  },

  async getExpiringCertificates(days: number = 30) {
    try {
      const response = await fetch(`${API_BASE_URL}/ssl/expiring?days=${days}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error in getExpiringCertificates:', error);
      throw new Error('Failed to fetch expiring certificates');
    }
  },

  async getSSLCertificate(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/ssl/${id}`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error in getSSLCertificate:', error);
      throw new Error('Failed to fetch SSL certificate');
    }
  },

  async getSSLSummary() {
    try {
      const response = await fetch(`${API_BASE_URL}/ssl/summary`, {
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error in getSSLSummary:', error);
      throw new Error('Failed to fetch SSL summary');
    }
  },

  async checkSSLCertificate(siteId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/ssl/check`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ siteId }),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error in checkSSLCertificate:', error);
      throw new Error('Failed to check SSL certificate');
    }
  },

  async checkAllSSLCertificates() {
    try {
      const response = await fetch(`${API_BASE_URL}/ssl/check-all`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error in checkAllSSLCertificates:', error);
      throw new Error('Failed to check all SSL certificates');
    }
  },

  async checkBulkSSLCertificates(siteIds: number[]) {
    try {
      const response = await fetch(`${API_BASE_URL}/ssl/check-bulk`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ siteIds }),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error in checkBulkSSLCertificates:', error);
      throw new Error('Failed to check SSL certificates');
    }
  },

  async sendSSLExpiryAlerts() {
    try {
      const response = await fetch(`${API_BASE_URL}/ssl/send-alerts`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error in sendSSLExpiryAlerts:', error);
      throw new Error('Failed to send SSL expiry alerts');
    }
  },
};

// Auth API
export const authApi = {
  async login(credentials: { email: string; password: string }) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  },

  async signup(userData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error in signup:', error);
      throw error;
    }
  },

  async forgotPassword(email: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error in forgotPassword:', error);
      throw error;
    }
  },
};