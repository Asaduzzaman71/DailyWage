import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const SelectInput = ({
  label,
  id,
  name,
  options = [],
  value,
  onChange,
  multiple = false,
  required = false,
  className = '',
  placeholder = 'Select option',
  disabled = false,
  error,
  valueKey = 'value',
  labelKey = 'label',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const wrapperRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option[labelKey].toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize selected items
  useEffect(() => {
    if (multiple) {
      setSelectedItems(options.filter(option => value.includes(option[valueKey])));
    } else {
      setSelectedItems(options.filter(option => option[valueKey] === value));
    }
  }, [value, options, multiple, valueKey]);

  const handleSelect = (option) => {
    if (multiple) {
      const newValue = selectedItems.some(item => item[valueKey] === option[valueKey])
        ? selectedItems.filter(item => item[valueKey] !== option[valueKey])
        : [...selectedItems, option];
      
      setSelectedItems(newValue);
      onChange({
        target: {
          name,
          value: newValue.map(item => item[valueKey])
        }
      });
    } else {
      setSelectedItems([option]);
      onChange({
        target: {
          name,
          value: option[valueKey]
        }
      });
      setIsOpen(false);
    }
  };

  const removeItem = (itemToRemove) => {
    const newItems = selectedItems.filter(item => item[valueKey] !== itemToRemove[valueKey]);
    setSelectedItems(newItems);
    onChange({
      target: {
        name,
        value: newItems.map(item => item[valueKey])
      }
    });
  };

  return (
    <div className={`${className} relative`} ref={wrapperRef}>
      {label && (
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div 
        className={`bg-gray-50 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1">
          {selectedItems.length > 0 ? (
            multiple ? (
              selectedItems.map(item => (
                <span 
                  key={item[valueKey]} 
                  className="inline-flex items-center px-2 py-1 bg-gray-200 dark:bg-gray-500 rounded text-xs"
                >
                  {item[labelKey]}
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item);
                    }}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </span>
              ))
            ) : (
              <span>{selectedItems[0][labelKey]}</span>
            )
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-lg shadow-lg">
          <div className="p-2 border-b border-gray-200 dark:border-gray-600">
            <input
              type="text"
              className="w-full p-1 text-sm bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <div
                  key={option[valueKey]}
                  className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer ${
                    selectedItems.some(item => item[valueKey] === option[valueKey]) 
                      ? 'bg-primary-100 dark:bg-primary-800' 
                      : ''
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option[labelKey]}
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500">No options found</div>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

SelectInput.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  onChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
};
export default SelectInput;