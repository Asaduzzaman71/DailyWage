// src/components/Login.jsx
import React, { useState } from 'react';
import FormInput from '../../components/el/FormInput.jsx';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';

export default function Example() {
  const login = useAuthStore(state => state.login);
  const isLoading = useAuthStore(state => state.isLoading);
  const error = useAuthStore(state => state.error);
  const validationErrors = useAuthStore(state => state.validationErrors);
  
  const [payload, setPayload] = useState({
    email: '',  
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPayload(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting payload:', payload);
      await login(payload);
      // Redirect on success
    } catch (err) {
      // Error is already handled in the store
    }
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

        {/* Error Message (for 401 Unauthorized) */}
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
              // error prop can still be used for backend errors
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
              error={validationErrors?.password?.[0]} // Show validation error
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
            disabled={isLoading}
            onClick={handleSubmit}
            className={`w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
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