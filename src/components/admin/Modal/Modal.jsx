const Modal = ({ 
  isOpen, 
  onClose, 
  title = "Modal Title",
  children,
  size = "4xl", // sm, md, lg, xl, full
  submitText = "Submit",
  cancelText = "Close",
  onSubmit,
  showFooter = true,
  showHeader = true,
  closeButton = true
}) => {
  if (!isOpen) return null;

  // Enhanced size classes with width percentages
  const sizeClasses = {
    sm: "w-full max-w-sm",    // 384px
    md: "w-full max-w-md",    // 448px
    lg: "w-full max-w-lg",    // 512px
    xl: "w-full max-w-xl",    // 576px
    '2xl': "w-full max-w-2xl", // 672px
    '3xl': "w-full max-w-3xl", // 768px
    '4xl': "w-full max-w-4xl", // 896px
    '5xl': "w-full max-w-5xl", // 1024px
    '6xl': "w-full max-w-6xl", // 1152px
    '7xl': "w-full max-w-7xl", // 1280px
    full: "w-full max-w-full"  
  };

  // Debug output
  console.log(`Modal size: ${size}, applying classes: ${sizeClasses[size]}`);
  return (
    <div 
      id="crud-modal" 
      tabIndex="-1" 
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 flex justify-center items-center w-full h-full ${isOpen ? '' : 'hidden'}`}
    >
      {/* Modal container with responsive width */}
      <div className={`relative p-4 ${sizeClasses[size]} max-h-full`}>
        <div className="relative bg-gray-100 rounded-lg shadow dark:bg-gray-700 overflow-auto max-h-[85vh]">
          {/* Header */}
          {showHeader && (
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200 sticky top-0 bg-gray-200 dark:bg-gray-700 z-10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              {closeButton && (
                <button 
                  type="button" 
                  onClick={onClose}
                  className="text-gray-700 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                >
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              )}
            </div>
          )}
          
          {/* Scrollable body content */}
          <div className="p-4 md:p-5 overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {showFooter && (
            <div className="flex items-center justify-end gap-2 p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600 sticky bottom-0 bg-gray-200 dark:bg-gray-700">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 text-white text-sm font-medium bg-red-600 hover:bg-red-700 rounded  transition-colors"
              >
                {cancelText}
              </button>
              {onSubmit && (
                <button 
                  type="button" 
                  onClick={onSubmit}
                  className="px-4 py-2 text-white text-sm font-medium bg-green-600 hover:bg-green-700 rounded  transition-colors"
                >
                  {submitText}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;