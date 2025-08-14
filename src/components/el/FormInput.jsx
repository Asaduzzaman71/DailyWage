import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const FormInput = ({
  label,
  type = 'text',
  name,
  id = name,
  placeholder,
  required = false,
  value,
  onChange,
  className = '',
  error: externalError, // Renamed to avoid conflict with internal error state
  disabled = false,
  readOnly = false,
  validateOnChange = true,
  validateOnBlur = true,
  ...props
}) => {
  const [internalError, setInternalError] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  // Validation rules
  const validate = (value) => {
    if (required && !value) {
      return `This field is required`;
    }

    if (value) {
      switch (type) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return 'Please enter a valid email address';
          }
          break;
        case 'password':
          if (value.length < 6) {
            return 'Password must be at least 6 characters';
          }
          break;
        case 'tel':
          const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
          if (!phoneRegex.test(value)) {
            return 'Please enter a valid phone number';
          }
          break;
        case 'url':
          const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
          if (!urlRegex.test(value)) {
            return 'Please enter a valid URL';
          }
          break;
        case 'number':
          if (isNaN(Number(value))) {
            return 'Please enter a valid number';
          }
          break;
        default:
          break;
      }
    }

    return '';
  };

  // Handle validation when value changes
  useEffect(() => {
    if (validateOnChange && isTouched) {
      setInternalError(validate(value));
    }
  }, [value, validateOnChange, isTouched]);

  const handleChange = (e) => {
    onChange(e); // Call parent onChange
  };

  const handleBlur = () => {
    console.log('Input blurred');
    setIsTouched(true);
    if (validateOnBlur) {
      setInternalError(validate(value));
    }
  };

  // Combine internal and external errors
  const error = internalError || externalError || '';

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
        onChange={handleChange}
        onBlur={handleBlur}
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
  validateOnChange: PropTypes.bool,
  validateOnBlur: PropTypes.bool,
};

FormInput.defaultProps = {
  validateOnChange: true,
  validateOnBlur: true,
};
 
export default FormInput;