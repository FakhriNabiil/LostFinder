import {apiService} from '../api/api'

export const login = async (email, password) => {
  try {
    const res = await apiService.login(email, password)
    return res
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Login gagal.', { cause: err })
  }
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export const getUser = () => {
  const user = localStorage.getItem('user');
  
  if (!user || user === "undefined") {
    return null; 
  }

  try {
    return JSON.parse(user);
  } catch (e) {
    console.error("Gagal parse user data", e);
    return null;
  }
};

export function isLoggedIn() {
  return !!localStorage.getItem('token')
}