import React, { useState, useCallback, useMemo } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useUsers } from '../../../hooks/useUsers';
import { useUserStore } from '../../../store/userStore.js';
import Breadcrumb from '../../../components/admin/Breadcrumb/Breadcrumb.jsx';
import Table from '../../../components/admin/Table/Table.jsx';
import Modal from '../../../components/admin/Modal/Modal.jsx';
import FormInput from '../../../components/el/FormInput.jsx';
import Pagination from '../../../components/pagination/Pagination.jsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from "../../../services";
const Users = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(1);
  
  // Get Zustand state and actions
  const { userList, error, validationErrors, setError, setValidationErrors } = useUserStore();
  const { data, isLoading, isError } = useUsers({ page, limit, search });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [modalType, setModalType] = useState('edit');
  const [payload, setPayload] = useState({
    name: '',
    phone: '',
    email: '',
  });

  // Memoized constants
  const breadcrumbItems = useMemo(() => [
    { path: '/users', label: 'Users' },
    { path: '/users', label: 'User List' },
  ], []);

  const headers = useMemo(() => [
    { key: 'name', label: 'Name', className: 'text-left' },
    { key: 'phone', label: 'Phone', className: 'text-left' },
    { key: 'email', label: 'Email', className: 'text-left' }
  ], []);

  const actionConfig = useMemo(() => ({
    actions: [
      {
        label: <FiEdit className='inline' />,
        onClick: (row) => openEditModal(row),
        className: 'text-indigo-600 hover:text-indigo-900'
      },
      {
        label: <FiTrash2 className='inline' />,
        onClick: (row) => openDeleteModal(row),
        className: 'text-red-600 hover:text-red-900'
      },
      
    ]
  }), []);

  // Memoized data
  const tableData = useMemo(() => data?.data?.users || [], [data]);
  const paginationData = useMemo(() => data?.data?.pagination || 1, [data]);

  const onPageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []); 
  // Callbacks with useCallback
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setPayload(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const openCreateModal = useCallback(() => {
    setCurrentRow(null);
    setPayload({ name: '', phone: '', email: '' });
    setModalType('add');
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((row) => {
    setPayload({
      name: row.name || '',
      phone: row.phone || '',
      email: row.email || '',
    });
    setCurrentRow(row);
    setModalType('edit');
    setIsModalOpen(true);
  }, []);

  const openDeleteModal = useCallback((row) => {
    setCurrentRow(row);
    setModalType('delete');
    setIsModalOpen(true);
  }, []);

  const handleClose = () => {
    setIsModalOpen(false);
  }
   const queryClient = useQueryClient();
  // Create the mutation
  const { mutate: updateUserMutation, isPending: isUpdating, isError: isUpdateError, error: updateError } = useMutation({
    mutationFn: userService.updateUser,
    onSuccess: () => {
      // Invalidate the 'users' query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['users'] });
      handleClose(); // Close modal on success
    },
    onError: (error) => {
      setError(error.message || 'Failed to update user');
    }
  });
  const handleSubmit = () => {
    if (modalType === 'edit' && currentRow) {
      // Trigger the mutation for an update
       updateUserMutation({ id: currentRow.id, ...payload });
    } else {
      // Handle delete or add logic here
      console.log('Form submitted with:', payload);
      handleClose();
    }
  };

  // Memoized modal content
  const renderModalContent = useMemo(() => {
    if (modalType === 'edit' || modalType === 'add') {
      return (
        <form className="p-4 md:p-5">
          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-2">
              <FormInput
                label="Name"
                name="name"
                type="text"
                value={payload.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <FormInput
                label="Phone"
                name="phone"
                type="phone"
                value={payload.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <FormInput
                label="Email"
                name="email"
                type="email"
                value={payload.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </form>
      );
    } else if (modalType === 'delete') {
      return (
        <div>
          <p>Are you sure you want to delete {currentRow?.name}?</p>
          <div className="mt-4 flex justify-end space-x-3">
            <button 
              onClick={handleClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      );
    }
    return null;
  }, [modalType, payload, currentRow, handleInputChange, handleClose, handleSubmit]);

  return (
    <> 
      <Breadcrumb items={breadcrumbItems} />
      <Table 
        headers={headers}
        data={tableData}
        actionConfig={actionConfig}
        containerClassName="my-6"
        headerClassName="bg-blue-50"
        isLoading={isLoading}
      />
      <Pagination totalPages={paginationData.totalPages} currentPage={paginationData.currentPage} onPageChange={onPageChange} />

      <Modal 
        isOpen={isModalOpen}  
        title={modalType === 'add' ? 'Add User' : modalType === 'edit' ? 'Edit User' : 'Delete User'}
        onClose={handleClose}
        onSubmit={modalType !== 'delete' ? handleSubmit : undefined}
        showFooter={modalType !== 'delete'}
        size='4xl'
      >
        {renderModalContent}
      </Modal>
    </>
  );
};

export default React.memo(Users);