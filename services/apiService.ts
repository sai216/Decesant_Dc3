/**
 * API Service - Central backend connection for the entire website
 * Replace API_BASE_URL with your actual backend URL
 */

// Get the API base URL from environment variable or use default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Generic API request handler with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
}

/**
 * Assessment/Audit Form APIs
 */
export const assessmentAPI = {
  // Submit goals and video
  submitGoalsAndVideo: async (data: {
    goals: string;
    videoLink?: string;
    loomLink?: string;
    uploadedFiles?: Array<{ name: string; size: number; type: string }>;
  }) => {
    return apiRequest('/assessment/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Verify email
  verifyEmail: async (email: string) => {
    return apiRequest('/assessment/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Validate LinkedIn and Phone
  validateContactInfo: async (data: {
    linkedinUrl: string;
    phoneNumber: string;
  }) => {
    return apiRequest('/assessment/validate-contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Book meeting
  bookMeeting: async (data: {
    meetingDate: string;
    meetingTime: string;
    email: string;
  }) => {
    return apiRequest('/assessment/book-meeting', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Complete assessment
  completeAssessment: async (fullData: any) => {
    return apiRequest('/assessment/complete', {
      method: 'POST',
      body: JSON.stringify(fullData),
    });
  },
};

/**
 * User/Auth APIs (if needed beyond Privy)
 */
export const userAPI = {
  createProfile: async (userData: any) => {
    return apiRequest('/users/profile', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getProfile: async (userId: string) => {
    return apiRequest(`/users/profile/${userId}`, {
      method: 'GET',
    });
  },
};

/**
 * File Upload API
 */
export const fileAPI = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary for multipart
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: errorData.message || `Upload failed: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  },

  uploadMultipleFiles: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/files/upload-multiple`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: errorData.message || `Upload failed: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  },
};

/**
 * Analytics/Tracking APIs
 */
export const analyticsAPI = {
  trackEvent: async (eventName: string, eventData: any) => {
    return apiRequest('/analytics/track', {
      method: 'POST',
      body: JSON.stringify({ eventName, eventData, timestamp: new Date().toISOString() }),
    });
  },
};

export default {
  assessmentAPI,
  userAPI,
  fileAPI,
  analyticsAPI,
};
