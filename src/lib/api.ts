// API service for barangay portal
// Connects to the backend API

const API_BASE_URL = import.meta.env.PROD ? '/api' : import.meta.env.VITE_API_URL || '/api';

function buildApiUrl(endpoint: string) {
  const base = API_BASE_URL.replace(/\/+$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
}

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  let response: Response;
  try {
    response = await fetch(buildApiUrl(endpoint), {
      ...options,
      headers,
    });
  } catch (error: any) {
    const msg = error?.message || 'Network error';
    throw new Error(`Unable to reach backend API. Check backend service and API_URL configuration. ${msg}`);
  }

  const text = await response.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || data?.error || response.statusText || 'API call failed';
    throw new Error(message);
  }

  return data;
}

// Admin Authentication Functions
export async function loginAdmin(username: string, password: string) {
  try {
    const response = await apiCall('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    return {
      token: response.token,
      user: response.user
    };
  } catch (error) {
    throw error;
  }
}

export async function registerAdmin(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  position: string;
  employeeId: string;
}) {
  try {
    const response = await apiCall('/auth/admin/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return response;
  } catch (error) {
    throw error;
  }
}

// Get barangay information
export async function getBarangayInfo() {
  try {
    const response = await apiCall('/barangay-info');
    return response;
  } catch (error) {
    throw error;
  }
}
export async function loginResident(username: string, password: string) {
  try {
    const response = await apiCall('/auth/resident/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    return {
      token: response.token,
      user: response.user
    };
  } catch (error) {
    throw error;
  }
}

export async function registerResident(data: {
  username: string;
  password: string;
  fullName: string;
  email: string;
  address: string;
  contactNumber: string;
  birthdate: string;
  gender: string;
  civilStatus: string;
}) {
  try {
    const response = await apiCall('/auth/resident/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return response;
  } catch (error) {
    throw error;
  }
}

// Admin API Functions
export async function getStaffAccounts(status?: string, page = 1, limit = 10) {
  try {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    return await apiCall(`/admin/staff?${params}`);
  } catch (error) {
    throw error;
  }
}

export async function approveStaffAccount(id: string) {
  try {
    return await apiCall(`/admin/staff/${id}/approve`, {
      method: 'PUT',
    });
  } catch (error) {
    throw error;
  }
}

export async function rejectStaffAccount(id: string) {
  try {
    return await apiCall(`/admin/staff/${id}/reject`, {
      method: 'PUT',
    });
  } catch (error) {
    throw error;
  }
}

export async function getResidents(status?: string, page = 1, limit = 10) {
  try {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    return await apiCall(`/admin/residents?${params}`);
  } catch (error) {
    throw error;
  }
}

export async function approveResident(id: string) {
  try {
    return await apiCall(`/admin/residents/${id}/approve`, {
      method: 'PUT',
    });
  } catch (error) {
    throw error;
  }
}

export async function rejectResident(id: string) {
  try {
    return await apiCall(`/admin/residents/${id}/reject`, {
      method: 'PUT',
    });
  } catch (error) {
    throw error;
  }
}

export async function updateResidentStatus(id: string, status: 'Active' | 'Inactive') {
  try {
    return await apiCall(`/admin/residents/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  } catch (error) {
    throw error;
  }
}

export async function createResident(data: {
  username: string;
  password: string;
  email: string;
  fullName: string;
  address: string;
  contactNumber: string;
  birthdate?: string;
  gender?: string;
  civilStatus?: string;
}) {
  try {
    return await apiCall('/admin/residents/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    throw error;
  }
}

export async function getServiceRequests(status?: string, page = 1, limit = 10) {
  try {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    return await apiCall(`/admin/service-requests?${params}`);
  } catch (error) {
    throw error;
  }
}

export async function updateServiceRequest(id: string, status: string, remarks?: string) {
  try {
    return await apiCall(`/admin/service-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, remarks }),
    });
  } catch (error) {
    throw error;
  }
}

// Resident API Functions
export async function getResidentProfile() {
  try {
    return await apiCall('/resident/profile');
  } catch (error) {
    throw error;
  }
}

export async function updateResidentProfile(data: any) {
  try {
    return await apiCall('/resident/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } catch (error) {
    throw error;
  }
}

export async function getResidentServiceRequests(page = 1, limit = 10) {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    return await apiCall(`/resident/service-requests?${params}`);
  } catch (error) {
    throw error;
  }
}

export async function createServiceRequest(serviceName: string, purpose: string) {
  try {
    return await apiCall('/resident/service-requests', {
      method: 'POST',
      body: JSON.stringify({ serviceName, purpose }),
    });
  } catch (error) {
    throw error;
  }
}

export async function getAvailableServices() {
  try {
    return await apiCall('/resident/services');
  } catch (error) {
    throw error;
  }
}

export async function getAnnouncements(page = 1, limit = 10) {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    return await apiCall(`/resident/announcements?${params}`);
  } catch (error) {
    throw error;
  }
}

// Services API Functions (Admin)
export async function getServices() {
  try {
    return await apiCall('/services');
  } catch (error) {
    throw error;
  }
}

export async function createService(data: any) {
  try {
    return await apiCall('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    throw error;
  }
}

export async function updateService(id: string, data: any) {
  try {
    return await apiCall(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteService(id: string) {
  try {
    return await apiCall(`/services/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    throw error;
  }
}