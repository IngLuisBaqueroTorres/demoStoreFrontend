import axios from 'axios';
import { type LoginCredentials } from '../components/forms/LoginForm';

const API_URL = 'http://localhost:8080/api/auth';

/**
 * Logs in a user.
 * @param credentials - The user's login credentials (email and password).
 * @returns The response from the server.
 */
export const login = async (credentials: LoginCredentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    // It's a good practice to handle errors,
    // maybe returning a specific error message or code.
    console.error('Login failed:', error);
    throw error;
  }
};
