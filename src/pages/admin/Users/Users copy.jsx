import React, {useState, useEffect, useMemo} from 'react'
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill} from 'react-icons/bs'
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Breadcrumb from '../../../components/admin/Breadcrumb/Breadcrumb.jsx'
import Table from '../../../components/admin/Table/Table.jsx'
import Modal from '../../../components/admin/Modal/Modal.jsx'
import FormInput from '../../../components/el/FormInput.jsx';
import SelectInput from '../../../components/el/SelectInput.jsx';
import FileUpload from '../../../components/el/FileUpload.jsx';
import TextArea from '../../../components/el/TextArea.jsx';
const Users = () =>{
    const breadcrumbItems = [
      { path: '/users', label: 'Users' },
       { path: '/users', label: 'User List' },
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
        categories: [],
        description: '' ,      // Use empty string (or 0 if you prefer),
        documents: [] // Use null for file uploads

    });

    // Update handler that preserves other fields
    const handleInputChange = (e) => {
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
    // const handleTextAreaChange = (e) => {
    //   const { name, value } = e.target; // Get the value from the textarea
    //   setPayload(prev => ({       
    //     ...prev,
    //     description: value // Update the description field  
    //   }));
    //   console.log('Updated payload:', payload);
    // };
  const renderModalContent = useMemo(() => {
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
                    onChange={handleInputChange}
                    options={categories}
                    valueKey='id'
                    labelKey='label'
                    multiple
                    placeholder="Select multiple categories"
                  />
              </div>
              <div className="col-span-2">
                  <TextArea
                    id="description"
                    label="Product Description"
                    name="description"
                    value={payload.description}
                    onChange={handleInputChange}
                  />
              </div>
              <div className="col-span-2">
                  <FileUpload
                    name="documents"
                    label="Upload Documents"
                    multiple
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.PNG,.JPG,.JPEG"
                    maxSize={10}
                    onChange={handleInputChange}
                  />
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
  }, [modalType, payload, currentRow]);
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
        <Table 
          headers={headers}
          data={userList}
          actionConfig={actionConfig}
          containerClassName="my-6"
          headerClassName="bg-blue-50"
        />

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title='Edit' onSubmit={() => console.log('Submitted')} showFooter={modalType == 'delete' ? false : true} size='4xl'>
          {renderModalContent}
        </Modal>
       </>
     
  )
}

export default Users