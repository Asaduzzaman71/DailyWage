import React, { useState } from 'react';
import FormInput from '../../components/el/FormInput.jsx';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
export default function SignUp() {
  const register = useAuthStore(state => state.register);
  const isLoading = useAuthStore(state => state.isLoading);
  const error = useAuthStore(state => state.error);
  const validationErrors = useAuthStore(state => state.validationErrors);
  const [payload, setPayload] = useState({
    firstName: '',
    lastName: '',
    email: '',  
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPayload(prev => ({
      ...prev,
      [name]: value
    }));
    console.log('Updated payload:', payload);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Heading */}
        <div className="text-center">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
            Create a new account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our community today
          </p>
        </div>

        {/* Sign Up Form */}
        <form className="mt-8 space-y-6" action="#" method="POST">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FormInput
                  label="First name"
                  name="firstName"
                  type="text"
                  value={payload.firstName}
                  onChange={handleInputChange}
                  required
                  validateOnBlur={true}
                  error={validationErrors?.firstName?.[0]}
                />
              </div>
              <div>
                <FormInput
                  label="Last name"
                  name="lastName"
                  type="text"
                  value={payload.lastName}
                  onChange={handleInputChange}
                  required
                  validateOnBlur={true}
                  error={validationErrors?.lastName?.[0]}
                />
              </div>
            </div>

            <div>
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
            </div>

            <div>
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

            <div>
              <FormInput
                label="Confirm password"
                name="confirmPassword"
                type="password"
                value={payload.confirmPassword}
                onChange={handleInputChange}
                required
                validateOnBlur={true}
                error={validationErrors?.confirmPassword?.[0]}
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms-and-privacy"
              name="terms-and-privacy"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              required
            />
            <label htmlFor="terms-and-privacy" className="ml-2 block text-sm text-gray-900">
              I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms</a> and <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
            </label>
          </div>

          <button
            type="button"
            onClick={(e) => {
                    e.preventDefault();
                    register(payload)
                }
            }  
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Sign up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}