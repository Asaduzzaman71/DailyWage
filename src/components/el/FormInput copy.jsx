import React from 'react';
import PropTypes from 'prop-types';

const FormInput = ({
  label,
  type = 'text',
  name,
  id = name,  // Default id to name if not provided
  placeholder,
  required = false,
  value,
  onChange,
  className = '',
  error,
  disabled = false,
  readOnly = false,
  ...props
}) => {
  const inputClasses = `bg-gray-50 border ${
    error ? 'border-red-500' : 'border-gray-300'
  } text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  }`;
  
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        id={id}
        className={inputClasses}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

FormInput.propTypes = {
  label: PropTypes.string,
  type: PropTypes.oneOf(['text', 'number', 'email', 'password', 'tel', 'url', 'search']),
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
};

export default FormInput;