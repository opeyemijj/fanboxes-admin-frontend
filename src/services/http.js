import axios from 'axios';
import { reduxStore } from 'src/redux/store';
import { setLogout } from 'src/redux/slices/user'; // Import your logout action



function getToken() {
  const cname = 'token';
  if (typeof window !== 'undefined') {
    let name = cname + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }
  return '';
}

const clearAuthCookies = () => {
  if (typeof window !== 'undefined') {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};


const baseURL = process.env.BASE_URL;
const http = axios.create({
  baseURL: baseURL + `/api`,
  timeout: 30000
});

http.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = ` ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Response interceptor
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        isNetworkError: true
      });
    }

    const { status, data } = error.response;

    // Auto-logout on 401/403
    if (status === 401 || status === 403) {
      // alert(status)
      // Clear auth cookies
      clearAuthCookies();
      
      // Dispatch Redux logout action
      reduxStore.dispatch(setLogout());
      
      // Redirect to login (handles both CSR and SSR)
      if (typeof window !== 'undefined') {
        const redirectUrl = status === 403 
          ? '/auth/login?error=forbidden' 
          : '/auth/login?session_expired=true';
        window.location.href = redirectUrl;
      }
      
      return Promise.reject({
        message: status === 403 ? 'Access denied' : 'Session expired',
        isAuthError: true,
        status
      });
    }

    // Enhanced error handling
    const errorMessage = data?.message || 
                        data?.error?.message || 
                        error.message || 
                        'Request failed';
    
    return Promise.reject({
      message: errorMessage,
      status,
      data: data || null,
      isExpectedError: true
    });
  }
);

export default http;
