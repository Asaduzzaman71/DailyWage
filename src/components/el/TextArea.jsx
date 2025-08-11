import PropTypes from 'prop-types';

const TextArea = ({
  id,
  label,
  value,
  onChange,
  placeholder='Type here...',
  rows = 4,
  className = '',
  labelClassName = '',
  textAreaClassName = '',
  disabled = false,
  error = null,
  ...props
}) => {
  // Base classes
  const baseLabelClasses = 'block mb-2 text-sm font-medium';
  const baseTextAreaClasses = 'block p-2.5 w-full text-sm rounded-lg border focus:ring-blue-500 focus:border-blue-500';

  // Light/dark mode classes
  const lightLabelClasses = 'text-gray-900';
  const darkLabelClasses = 'dark:text-white';
  
  const lightTextAreaClasses = 'text-gray-900 bg-gray-50 border-gray-300 placeholder-gray-400';
  const darkTextAreaClasses = 'dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';

  // Error state classes
  const errorClasses = 'border-red-500 focus:ring-red-500 focus:border-red-500';
  const darkErrorClasses = 'dark:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500';

  // Combine all classes
  const combinedLabelClasses = `${baseLabelClasses} ${lightLabelClasses} ${darkLabelClasses} ${labelClassName}`;
  const combinedTextAreaClasses = `
    ${baseTextAreaClasses} 
    ${lightTextAreaClasses} 
    ${darkTextAreaClasses} 
    ${error ? `${errorClasses} ${darkErrorClasses}` : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${textAreaClassName}
  `;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className={combinedLabelClasses}>
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={combinedTextAreaClasses}
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

TextArea.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  textAreaClassName: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
};

export default TextArea;