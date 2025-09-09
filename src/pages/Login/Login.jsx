// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authService } from "../../services";
import { useMutation } from '@tanstack/react-query';
import FormInput from '../../components/el/FormInput.jsx';
import { formatValidationErrors } from '../../utils/errorFormatter.js'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
export default function Login() {
  const navigate = useNavigate();
  const [payload, setPayload] = useState({
    email: '',  
    password: '',
  });

  // Get Zustand state and actions
  const {
    error,
    validationErrors,
    setUser,
    setError,
    setValidationErrors,
    clearAuth
  } = useAuthStore();

  // Login mutation with TanStack Query's isLoading
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onMutate: () => {
       console.log('Login mutation started');
      setError(null);
      setValidationErrors(null);
    },
    onSuccess: (response) => {
      console.log('Login success:', response);
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      toast.success(response.data.message);
      navigate('/dashboard')
    },
    onError: (error) => {
       console.log('Login error:', error);
      // Handle different error types
      if (error.response?.status === 400) {
          const formatted = formatValidationErrors(error.response.data.errors);
          setValidationErrors(formatted);
      } else {
        setError(error.response?.data?.message || "Login failed");
      }
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPayload(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(payload);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12 lg:px-8">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo & Heading */}
        <div className="text-center">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <FormInput
              label="Email address"
              name="email"
              type="email"
              value={payload.email}
              onChange={handleInputChange}
              required
              validateOnBlur={true}
              error={validationErrors?.email?.[0]}
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              value={payload.password}
              onChange={handleInputChange}
              required
              validateOnBlur={true}
              error={validationErrors?.password?.[0]}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="button"
            disabled={loginMutation.isLoading}
            onClick={handleSubmit}
            className={`w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              loginMutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loginMutation.isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Not registered yet?{" "}
          <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}