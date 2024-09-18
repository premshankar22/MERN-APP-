import React, { useState, useEffect } from 'react';
import './EmployeeList.css'; // Import the CSS file
import EmployeeForm from './EmployeeForm';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/employees');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.email.toLowerCase().includes(search.toLowerCase()) ||
      employee.designation.toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });


  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);


  
  const handleFormClose = () => {
    setShowForm(false);
    setSelectedEmployee(null);
    fetchEmployees();
  };

  const handleEditClick = (emp) => {
    setSelectedEmployee(emp);
    setShowForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };


  const handleStatusToggle = async (id) => {
    try {
      const employee = employees.find(emp => emp._id === id);
      const updatedEmployee = { ...employee, active: !employee.active };
      const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEmployee),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchEmployees();
    } catch (error) {
      console.error('Error toggling employee status:', error);
    }
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };



  return (
      <div className="employee-list">
      <h1>Employee List</h1>

      <div className="form-container">
        {/* SearchBar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Name, Email, or Designation"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
           {/* Total Count Display */}
          <div className="total-count">
          <p>Total Count: {employees.length}</p>
        </div>
        </div>

        {/* Create Employee Button */}
        <div className="create-employee">
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Create Employee'}
          </button>
          
        </div>
      {/*  {showForm && <EmployeeForm onClose={handleFormClose} selectedEmployee/>}  */}
        {showForm && <EmployeeForm onClose={handleFormClose} selectedEmployee={selectedEmployee} />}
        {/* Employee Table */}
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('_id')}>Employee ID</th>
              <th>Image</th>
              <th  onClick={() => handleSort('name')}>Name</th>
              <th onClick={() => handleSort('email')}>Email</th>
              <th>Mobile No</th>
              <th onClick={() => handleSort('designation')}>Designation</th>
              <th>Gender</th>
              <th>Course</th>
              <th onClick={() => handleSort('createDate')}>Create Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {filteredEmployees.map((emp) => (
               <tr key={emp._id ? emp._id.toString() : 'undefined'}>
                <td>{emp._id ? emp._id.toString() : 'N/A'}</td>
                <td> <img src={`http://localhost:5000${emp.image}`}alt={emp.name} className="employee-image" /></td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.mobile}</td>
                <td>{emp.designation}</td>
                <td>{emp.gender}</td>
                <td>{emp.course.join(',')}</td>
                <td>{new Date(emp.createDate).toLocaleDateString()}</td>
                <td>
                <button
                    className={emp.active ? 'active-btn' : 'inactive-btn'}
                    onClick={() => handleStatusToggle(emp._id)}
                  >
                    {emp.active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
                <div class="action-buttons">
                <td>
                <button class="edit-btn" onClick={() => handleEditClick(emp)}>Edit</button>
                <button  class="delete-btn" onClick={() => handleDeleteClick(emp._id)}>Delete</button>
                </td>
                </div>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
        <button 
          onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {Math.ceil(filteredEmployees.length / employeesPerPage)}</span>
        <button 
          onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(filteredEmployees.length / employeesPerPage)))}
          disabled={currentPage === Math.ceil(filteredEmployees.length / employeesPerPage)}
        >
          Next
        </button>
      </div>
      </div>
    </div>
  );
};

export default EmployeeList;
