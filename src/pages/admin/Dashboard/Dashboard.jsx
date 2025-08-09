import React, {useState, useEffect} from 'react'
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill} from 'react-icons/bs'
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Breadcrumb from '../../../components/admin/Breadcrumb/Breadcrumb.jsx'
import './Dashboard.css'
import Table from '../../../components/admin/Table/Table.jsx'
import Modal from '../../../components/admin/Modal/Modal.jsx'
import FormInput from '../../../components/el/FormInput.jsx';
import SelectInput from '../../../components/el/SelectInput.jsx';
const Dashboard = () =>{

    const data = [
        {
          name: 'Page A',
          uv: 4000,
          pv: 2400,
          amt: 2400,
        },
        {
          name: 'Page B',
          uv: 3000,
          pv: 1398,
          amt: 2210,
        },
        {
          name: 'Page C',
          uv: 2000,
          pv: 9800,
          amt: 2290,
        },
        {
          name: 'Page D',
          uv: 2780,
          pv: 3908,
          amt: 2000,
        },
        {
          name: 'Page E',
          uv: 1890,
          pv: 4800,
          amt: 2181,
        },
        {
          name: 'Page F',
          uv: 2390,
          pv: 3800,
          amt: 2500,
        },
        {
          name: 'Page G',
          uv: 3490,
          pv: 4300,
          amt: 2100,
        },
      ];
    const breadcrumbItems = [
      { path: '/', label: 'Home' },
      { path: '/dashboard', label: 'Dashboard' }
    ];

    const headers = [
    { key: 'name', label: 'Name', className: 'text-left' },
    { key: 'age', label: 'Age', className: 'text-left' },
    { key: 'address', label: 'Address', className: 'text-left' }
  ];

  const userList = [
    { id: 1, name: 'John Brown', age: 45, address: 'New York No. 1 Lake Park' },
    { id: 2, name: 'Jim Green', age: 27, address: 'London No. 1 Lake Park' },
    { id: 3, name: 'Joe Black', age: 31, address: 'Sidney No. 1 Lake Park' }
  ];

  const categories = [
    { id: 1, value: 'TV', label: 'TV/Monitors' },
    { id: 2, value: 'PC', label: 'PC' },
    { id: 3, value: 'GA', label: 'Gaming/Console' },
    { id: 4, value: 'PH', label: 'Phones' }
  ]
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [modalType, setModalType] = useState('edit'); // 'edit' or 'delete'
  const actionConfig = {
    actions: [
      {
        label: <FiEdit className='inline'/>,
        onClick: (row) => openEditModal(row),
        className: 'text-indigo-600 hover:text-indigo-900'
      },
      {
        label: <FiTrash2 className='inline'/>,
        onClick: (row) => openDeleteModal(row),
        className: 'text-red-600 hover:text-red-900'
      }
    ]
  };
  const [payload, setPayload] = useState({
    username: '',  // Use empty string instead of null
    age: '',
    categories: []       // Use empty string (or 0 if you prefer),

  });

  // Update handler that preserves other fields
  const handleInputChange = (e) => {
    console.log('Input changed:', e.target.name, e.target.value);
    const { name, value } = e.target;
    setPayload(prev => ({
      ...prev,
      [name]: value
    }));
    console.log('Updated payload:', payload);
  };
  const handleCategoryChange = (e) => {
    console.log('Category changed:', e.target);
      let selectedValues;
      // For single select
      selectedValues = e.target.value;
      setPayload(prev => ({
        ...prev,
        categories: selectedValues
      }));
  };
  const renderModalContent = () => {
    if (modalType === 'edit' || modalType === 'create') {
      return (
        <form className="p-4 md:p-5">
          <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                  <FormInput
                    label="Username"
                    name="username"
                    type="text"
                    value={payload.username}
                    onChange={handleInputChange}
                    required
                  />
              </div>
              <div className="col-span-2 sm:col-span-1">
                  <FormInput
                    label="Age"
                    name="age"
                    type="number"
                    value={payload.age}
                    onChange={handleInputChange}
                    required
                  />
              </div>
              <div className="col-span-2 sm:col-span-1">
                  <SelectInput
                    label="Categories"
                    name="categories"
                    id="categories"
                    value={payload.categories}
                    onChange={handleCategoryChange}
                    options={categories}
                    valueKey='id'
                    labelKey='label'
                    multiple
                    placeholder="Select multiple categories"
                  />
              </div>
              <div className="col-span-2">
                  <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Description</label>
                  <textarea id="description" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write product description here"></textarea>                    
              </div>
          </div>
        </form>
      );
    } else if (modalType === 'delete') {
      return (
          <div>
            <p>Are you sure you want to delete {currentRow.name}?</p>
              <div className="mt-4 flex justify-end space-x-3">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    // Handle delete logic here
                    console.log('Deleting:', currentRow);
                    setIsModalOpen(false);
                  }} 
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
          </div>
      );
    }
    return null;
  };
  const openCreateModal = () => {
    setCurrentRow();
    setModalType('add');
    setIsModalOpen(true);
  };

  const openEditModal = (row) => {
    setCurrentRow(row);
    setModalType('edit');
    setIsModalOpen(true);
  };
  const openDeleteModal = (row) => {
    setCurrentRow(row);
    setModalType('delete');
    setIsModalOpen(true);
  };

  return (
       <> 
        <Breadcrumb items={breadcrumbItems} />

        <div className='main-cards'>
            <div className='card bg-blue-300'>
                <div className='card-inner'>
                    <h3>PRODUCTS</h3>
                    <BsFillArchiveFill className='card_icon'/>
                </div>
                <h1>300</h1>
            </div>
            <div className='card bg-amber-200'>
                <div className='card-inner'>
                    <h3>CATEGORIES</h3>
                    <BsFillGrid3X3GapFill className='card_icon'/>
                </div>
                <h1>12</h1>
            </div>
            <div className='card  bg-orange-200'>
                <div className='card-inner'>
                    <h3>CUSTOMERS</h3>
                    <BsPeopleFill className='card_icon'/>
                </div>
                <h1>33</h1>
            </div>
            <div className='card bg-green-200'>
                <div className='card-inner'>
                    <h3>ALERTS</h3>
                    <BsFillBellFill className='card_icon'/>
                </div>
                <h1>42</h1>
            </div>
        </div>
       
        <Table 
          headers={headers}
          data={userList}
          actionConfig={actionConfig}
          containerClassName="my-6"
          headerClassName="bg-blue-50"
        />

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title='Edit' onSubmit={() => console.log('Submitted')} showFooter={modalType == 'delete' ? false : true} size='xl'>
          {renderModalContent()}
        </Modal>
       </>
     
  )
}

export default Dashboard