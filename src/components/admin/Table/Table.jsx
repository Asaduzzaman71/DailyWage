import PropTypes from 'prop-types';

const Table = ({ 
  headers, 
  data, 
  actionConfig,
  className = '',
  containerClassName = '',
  headerClassName = 'bg-gray-50',
  rowClassName = 'hover:bg-gray-50',
  cellClassName = 'px-6 py-4 whitespace-nowrap',
  textClassName = 'text-sm',
  actionCellClassName = 'text-right'
}) => {
  return (
    <div className={`border border-gray-200 rounded-lg shadow-sm overflow-hidden my-3 ${containerClassName}`}>
      <div className="overflow-x-auto">
        <table className={`min-w-full border-collapse ${className}`}>
          <thead>
            <tr className={headerClassName}>
              {headers.map((header, index) => (
                <th 
                  key={index}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${header.className || ''}`}
                >
                  {header.label}
                </th>
              ))}
              {actionConfig && (
                <th scope="col" className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${actionCellClassName}`}>
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowClassName}>
                {headers.map((header, headerIndex) => (
                  <td 
                    key={headerIndex}
                    className={`${cellClassName} ${textClassName} ${header.cellClassName || ''}`}
                  >
                    {row[header.key]}
                  </td>
                ))}
                {actionConfig && (
                  <td className={`${cellClassName} ${textClassName} font-medium ${actionCellClassName}`}>
                    {actionConfig.actions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        type="button"
                        onClick={() => action.onClick(row)}
                        className={`${action.className || 'text-blue-600 hover:text-blue-900 font-medium'} mr-3 last:mr-0`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Table.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      className: PropTypes.string,
      cellClassName: PropTypes.string
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  actionConfig: PropTypes.shape({
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        className: PropTypes.string
      })
    )
  }),
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  rowClassName: PropTypes.string,
  cellClassName: PropTypes.string,
  textClassName: PropTypes.string,
  actionCellClassName: PropTypes.string
};

export default Table;