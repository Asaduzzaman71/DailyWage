const  Table = () =>{
  // Sample data
  const workers = [
    { id: 1, name: 'Rajesh Kumar', occupation: 'Plumber', experience: '5 years', rating: '4.8', location: 'Mumbai' },
    { id: 2, name: 'Sunita Patel', occupation: 'Electrician', experience: '3 years', rating: '4.5', location: 'Delhi' },
    { id: 3, name: 'Vijay Singh', occupation: 'Carpenter', experience: '7 years', rating: '4.9', location: 'Bangalore' },
    { id: 4, name: 'Priya Sharma', occupation: 'Cleaner', experience: '2 years', rating: '4.2', location: 'Hyderabad' },
  ];

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 text-left">ID</th>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Occupation</th>
            <th className="py-3 px-4 text-left">Experience</th>
            <th className="py-3 px-4 text-left">Rating</th>
            <th className="py-3 px-4 text-left">Location</th>
            <th className="py-3 px-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {workers.map((worker) => (
            <tr key={worker.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4">{worker.id}</td>
              <td className="py-3 px-4 font-medium">{worker.name}</td>
              <td className="py-3 px-4">
                <span className="bg-blue-100 text-blue-800 py-1 px-2 rounded-full text-xs">
                  {worker.occupation}
                </span>
              </td>
              <td className="py-3 px-4">{worker.experience}</td>
              <td className="py-3 px-4">
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1">★</span>
                  {worker.rating}
                </div>
              </td>
              <td className="py-3 px-4">{worker.location}</td>
              <td className="py-3 px-4">
                <button className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md text-sm transition-colors">
                  Hire
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Table;