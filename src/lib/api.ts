// API service layer for backend communication

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Volunteer API calls
export const volunteerApi = {
  // Get all volunteers
  async getAll(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch('/api/volunteers');
      const data = await response.json();
      return { success: true, data: data.volunteers };
    } catch (error) {
      return { success: false, error: 'Failed to fetch volunteers' };
    }
  },

  // Create new volunteer
  async create(volunteerData: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch('/api/volunteers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(volunteerData),
      });
      const data = await response.json();
      return { success: true, data: data.volunteer };
    } catch (error) {
      return { success: false, error: 'Failed to create volunteer' };
    }
  }
};

// Participant API calls
export const participantApi = {
  // Get all participants
  async getAll(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch('/api/participants');
      const data = await response.json();
      return { success: true, data: data.participants };
    } catch (error) {
      return { success: false, error: 'Failed to fetch participants' };
    }
  },

  // Create new participant
  async create(participantData: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch('/api/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(participantData),
      });
      const data = await response.json();
      return { success: true, data: data.participant };
    } catch (error) {
      return { success: false, error: 'Failed to create participant' };
    }
  }
};

// Scanning API calls
export const scanApi = {
  // Process QR code scan
  async processScan(qrCode: string, volunteerId?: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrCode, volunteerId }),
      });
      const data = await response.json();
      
      if (data.success) {
        return { success: true, data };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: 'Failed to process scan' };
    }
  },

  // Get scan statistics
  async getStats(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch('/api/scan');
      const data = await response.json();
      return { success: true, data: data.stats };
    } catch (error) {
      return { success: false, error: 'Failed to fetch scan statistics' };
    }
  }
};

// Utility function for API calls
export const apiCall = async <T>(
  url: string, 
  options?: RequestInit
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}; 