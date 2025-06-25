// API service functions for SSL monitoring

// Use HTTP for local development to avoid SSL certificate issues
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
}

// Helper function to handle API responses
async function handleApiResponse(response: Response) {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    
    try {
      const errorText = await response.text();
      if (errorText) {
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.title || errorMessage;
        } catch {
          errorMessage = errorText;
        }
      }
    } catch {
      // If we can't read the response, use the status
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
      console.log('Fetching sites from:', `${API_BASE_URL}/sites`);
      console.log('Auth headers:', getAuthHeaders());
      
      const response = await fetch(`${API_BASE_URL}/sites`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      console.log('Sites response status:', response.status);
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error in getAllSites:', error);
      throw new Error('Failed to fetch sites. Please ensure you are logged in and the backend server is running.');
    }
  },

  async getSite(id: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/sites/${id}`, {
        method: 'GET',
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
      console.log('Creating site with data:', siteData);
      console.log('API URL:', `${API_BASE_URL}/sites`);
      console.log('Headers:', getAuthHeaders());
      
      const response = await fetch(`${API_BASE_URL}/sites`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(siteData),
      });
      
      console.log('Create site response status:', response.status);
      console.log('Create site response headers:', Object.fromEntries(response.headers.entries()));
      
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error in createSite:', error);
      throw error;
    }
  },

  async updateSite(id: number, siteData: { name: string; url: string; isActive: boolean }) {
    try {
      console.log('Updating site with data:', siteData);
      
      const response = await fetch(`${API_BASE_URL}/sites/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(siteData),
      });
      
      console.log('Update site response status:', response.status);
      await handleApiResponse(response);
      return true;
    } catch (error) {
      console.error('Error in updateSite:', error);
      throw error;
    }
  },

  async deleteSite(id: number) {
    try {
      console.log('Deleting site with id:', id);
      
      const response = await fetch(`${API_BASE_URL}/sites/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      console.log('Delete site response status:', response.status);
      await handleApiResponse(response);
      return true;
    } catch (error) {
      console.error('Error in deleteSite:', error);
      throw error;
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
      console.log('Checking SSL certificate for site:', siteId);
      const response = await fetch(`${API_BASE_URL}/ssl/check`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ siteId }),
      });
      console.log('SSL check response status:', response.status);
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

// Performance API (for future Lighthouse integration)
export const performanceApi = {
  async getPerformanceMetrics(siteId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/performance/${siteId}`, {
        headers: getAuthHeaders(),
      });
      
      if (response.status === 404) {
        throw new Error('No performance metrics found for this site');
      }
      
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error in getPerformanceMetrics:', error);
      throw new Error('Failed to fetch performance metrics. Please ensure the site exists and try again.');
    }
  },

  async runLighthouseAudit(siteId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/performance/lighthouse/${siteId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error in runLighthouseAudit:', error);
      throw new Error('Failed to run Lighthouse audit');
    }
  },
};