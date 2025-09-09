import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
// import { AllApiEndPoints } from './apiEndpoints.js';
// Enhanced tracking state
// const apiCallState = {
//   pending: {},
//   completed: {},
//   lastUpdated: null
// };

// Improved pattern matching with better regex handling
// function getPatternKey(url) {
//   if (!url) return null;
  
//   for (const group in AllApiEndPoints) {
//     for (const key in AllApiEndPoints[group]) {
//       try {
//         // Create regex from pattern (handling special characters properly)
//         const pattern = AllApiEndPoints[group][key];
//         const regex = new RegExp(pattern);
//         if (regex.test(url)) {
//           return `${group}:${key}`;
//         }
//       } catch (e) {
//         console.error(`Invalid regex pattern for ${group}:${key}`, e);
//       }
//     }
//   }
//   return null;
// }

// Consolidated tracking functions
// function trackCallStart(url) {
//   if (!url) return;

//   const patternKey = getPatternKey(url);
//   const callId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
//   apiCallState.pending[callId] = {
//     url,
//     patternKey,
//     startedAt: Date.now(),
//     status: 'pending'
//   };
  
//   apiCallState.lastUpdated = Date.now();
//   return callId;
// }

// function trackCallEnd(url) {
//   if (!url) return;

//   // Find the call in pending state
//   const callId = Object.keys(apiCallState.pending).find(
//     id => apiCallState.pending[id].url === url
//   );

//   if (callId) {
//     const call = apiCallState.pending[callId];
    
//     // Move to completed
//     apiCallState.completed[callId] = {
//       ...call,
//       completedAt: Date.now(),
//       duration: Date.now() - call.startedAt,
//       status: 'completed'
//     };
    
//     // Remove from pending
//     delete apiCallState.pending[callId];
//     apiCallState.lastUpdated = Date.now();
//   }
// }

// Enhanced API handler
  const createApiHandler = ({ accessToken = true } = {}) => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 20000,
      headers: accessToken ? {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      } : {}
    });

    instance.interceptors.request.use(config => {
      if (config.formData) {
        config.headers['Content-Type'] = 'multipart/form-data';
      }
      
      if (accessToken){
        if(!isValidToken()) {
          logout()
          return Promise.reject(new Error('Token expired')); // Prevent the request
        } 
      }

      
      // Add tracking metadata
      // config.metadata = {
      //   callId: trackCallStart(config.url)
      // };
      
      return config;
    });

    instance.interceptors.response.use(
      response => {
        // trackCallEnd(response.config.url);
        return response;
      },
      error => {
        if (error.config) {

          console.log('API Error:', error.config.url, error.message);
          // trackCallEnd(error.config.url);
          if (error.response?.status === 401 && error.config.url != '/auth/login') logout();
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }

  export const isValidToken = () => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
  export const logout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  }
// Utility functions
// export const getApiCallState = () => ({
//   pending: {...apiCallState.pending},
//   completed: {...apiCallState.completed},
//   lastUpdated: apiCallState.lastUpdated,
//   isPending: (endpointPattern) => {
//     return Object.values(apiCallState.pending).some(
//       call => call.patternKey === endpointPattern
//     );
//   }
// });

export const Api = createApiHandler;