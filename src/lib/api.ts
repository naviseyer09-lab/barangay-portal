// API service for admin authentication
// In production, this would connect to your backend API

import { getAuthToken } from './auth';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Initialize default admin account if none exists
export function initializeAdminAccounts() {
  const adminsStr = localStorage.getItem('barangay_admin_accounts');
  let admins = adminsStr ? JSON.parse(adminsStr) : [];

  // Check if any approved admin exists
  const hasApprovedAdmin = admins.some((admin: any) => admin.status === 'approved');

  if (!hasApprovedAdmin) {
    // Create default admin account
    const defaultAdmin = {
      id: generateId(),
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@barangay.com',
      phone: '09123456789',
      position: 'Barangay Administrator',
      employeeId: 'ADMIN001',
      username: 'admin',
      password: 'admin123',
      role: 'Super Admin',
      status: 'approved',
      createdAt: new Date().toISOString()
    };

    admins.push(defaultAdmin);
    localStorage.setItem('barangay_admin_accounts', JSON.stringify(admins));
  }
}

export async function loginAdmin(username: string, password: string) {
  try {
    // In production, this would be a real API call
    // For now, we'll simulate an API call with stored credentials

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Get stored admin accounts from localStorage
    const adminsStr = localStorage.getItem('barangay_admin_accounts');
    const admins = adminsStr ? JSON.parse(adminsStr) : [];

    // Find matching admin
    const admin = admins.find((a: any) => a.username === username);

    if (!admin) {
      throw new Error('Invalid username or password');
    }

    // Check if admin account is approved
    if (admin.status === 'pending') {
      throw new Error('Your account is pending approval. Please contact the barangay administrator.');
    }

    if (admin.status === 'rejected') {
      throw new Error('Your account has been rejected. Please contact the barangay administrator.');
    }

    // Verify password (in production, this would be hashed)
    if (admin.password !== password) {
      throw new Error('Invalid username or password');
    }

    // Generate a session token
    const token = generateToken();

    return {
      token,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role || 'Admin'
      }
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
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Get existing admins
    const adminsStr = localStorage.getItem('barangay_admin_accounts');
    const admins = adminsStr ? JSON.parse(adminsStr) : [];

    // Check if username already exists
    if (admins.some((a: any) => a.username === data.username)) {
      throw new Error('Username already exists');
    }

    // Check if email already exists
    if (admins.some((a: any) => a.email === data.email)) {
      throw new Error('Email already exists');
    }

    // Check if employee ID already exists
    if (admins.some((a: any) => a.employeeId === data.employeeId)) {
      throw new Error('Employee ID already exists');
    }

    // Create new admin with approved status
    const newAdmin = {
      id: generateId(),
      ...data,
      role: 'Staff',
      status: 'approved', // Auto-approve new registrations
      createdAt: new Date().toISOString()
    };

    admins.push(newAdmin);
    localStorage.setItem('barangay_admin_accounts', JSON.stringify(admins));

    return {
      success: true,
      message: 'Registration successful! Your account has been approved and you can now log in.'
    };
  } catch (error) {
    throw error;
  }
}

export async function verifyToken(token: string) {
  try {
    // Simulate token verification
    await new Promise(resolve => setTimeout(resolve, 300));

    // In production, verify token with backend
    return token.length > 0;
  } catch {
    return false;
  }
}

function generateToken(): string {
  return 'admin_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function generateId(): string {
  return 'admin_' + Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// API call wrapper with authentication
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}
