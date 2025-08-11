import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { 
  FaFilePdf, 
  FaFileWord, 
  FaFileExcel, 
  FaFilePowerpoint, 
  FaFileArchive, 
  FaFileAlt,
  FaFile
} from 'react-icons/fa';
const FileUpload = ({
  label,
  name,
  multiple = false,
  accept = 'image/*',
  maxSize = 5, // in MB
  required = false,
  disabled = false,
  onChange,
  error,
  className = '',
}) => {
    const [files, setFiles] = useState([]);
     const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          processFiles(Array.from(e.dataTransfer.files));
        }
    }, []);

    const handleChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
          processFiles(Array.from(e.target.files));
          e.target.value = ''; // Reset input to allow selecting same file again
        }
    };
    const isFileTypeValid = (file, acceptPattern) => {
        if (!acceptPattern) return true; // No restrictions
        
        // Handle extensions like ".pdf" or "pdf"
        if (acceptPattern.startsWith('.') || /^\w+$/.test(acceptPattern)) {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const acceptedExtensions = acceptPattern
            .split(',')
            .map(ext => ext.trim().replace(/^\./, '').toLowerCase());
            return acceptedExtensions.includes(fileExtension);
        }
        
        // Handle MIME types like "image/*" or "application/pdf"
        const acceptedTypes = acceptPattern.split(',').map(t => t.trim());
        return acceptedTypes.some(pattern => {
            if (pattern.endsWith('/*')) {
                return file.type.startsWith(pattern.replace('/*', '/'));
            }
            return file.type === pattern;
        });
    };
    const processFiles = (newFiles) => {
        console.log('Processing files:', newFiles);
        const validFiles = [];
        const errors = [];

        newFiles.forEach((file) => {
            // Check file size
            if (file.size > maxSize * 1024 * 1024) {
                errors.push(`${file.name} exceeds maximum file size of ${maxSize}MB`);
                return;
            }
            // Check file type
            if (accept && !isFileTypeValid(file, accept)) {
                errors.push(`${file.name} has invalid file type. Accepted: ${accept}`);
                return;
            }
            validFiles.push(file);
        });

        if (errors.length > 0) {
          toast.error(errors.join('\n'));
        }

        if (validFiles.length > 0) {
        const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
        setFiles(updatedFiles);
        
        // Convert to FileList for consistency with native input
        const dataTransfer = new DataTransfer();
        updatedFiles.forEach(file => dataTransfer.items.add(file));
        
        onChange({
            target: {
            name,
            files: dataTransfer.files,
            value: updatedFiles,
            },
        });
        }
    };

    const removeFile = (index) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        
        const dataTransfer = new DataTransfer();
        updatedFiles.forEach(file => dataTransfer.items.add(file));
        
        onChange({
        target: {
            name,
            files: updatedFiles.length > 0 ? dataTransfer.files : null,
            value: updatedFiles,
        },
        });
    };

    const getFilePreview = (file) => {
        if (file.type.startsWith('image/')) {
            return URL.createObjectURL(file);
        }
        
        // You can add more file type previews here
        const fileExtension = file.type.split('/')[1] || file.name.split('.').pop();
        console.log('File extension:', fileExtension);
         // Icon component mapping
        const iconMap = {
          pdf: <FaFilePdf className="text-red-500 text-4xl" />,
          doc: <FaFileWord className="text-blue-500 text-4xl" />,
          docx: <FaFileWord className="text-blue-500 text-4xl" />,
          xls: <FaFileExcel className="text-green-500 text-4xl" />,
          xlsx: <FaFileExcel className="text-green-500 text-4xl" />,
          ppt: <FaFilePowerpoint className="text-orange-500 text-4xl" />,
          pptx: <FaFilePowerpoint className="text-orange-500 text-4xl" />,
          zip: <FaFileArchive className="text-purple-500 text-4xl" />,
          rar: <FaFileArchive className="text-purple-500 text-4xl" />,
          txt: <FaFileAlt className="text-gray-500 text-4xl" />,
        };

        const fileIcon = iconMap[fileExtension] || <FaFile className="text-gray-500 text-4xl" />;
        
        return (
        <div className="flex flex-col items-center justify-center h-full">
            {fileIcon }
            <span className="text-xs truncate w-full text-center">{file.name}</span>
        </div>
        );
    };

  return (
    <div className={`${className} space-y-2`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          name={name}
          id={name}
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center justify-center space-y-2">
          <svg
            className="w-12 h-12 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          
          <div className="flex flex-col items-center justify-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                Click to upload
              </span>{' '}
              or drag and drop
            </p>
            <p className="text-xs">
              {accept ? `Supported formats: ${accept}` : 'Any file type'} (Max {maxSize}MB)
            </p>
          </div>
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {files.map((file, index) => (
            <div 
              key={`${file.name}-${index}`} 
              className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 h-32"
            >
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                getFilePreview(file)
              )}
              
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer"
                  title="Remove file"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 truncate">
                {file.name}
              </div>
            </div>
          ))}
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

FileUpload.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  accept: PropTypes.string,
  maxSize: PropTypes.number,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  className: PropTypes.string,
};

export default FileUpload;