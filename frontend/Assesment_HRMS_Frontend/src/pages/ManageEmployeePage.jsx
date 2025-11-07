import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../componets/Header';
import Footer from '../componets/Footer';
import './css/ManageEmployeePage.css';

const ManageEmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedDept, setSelectedDept] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  // 🔹 Fetch employees from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/employes');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
        alert('Failed to load employees. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // 🔹 Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    try {
      await axios.delete(`http://localhost:8000/api/employe/${id}`);
      alert('Employee deleted successfully!');
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee.');
    }
  };

  // 🔹 Handle update (simple example, navigate to edit page or inline edit later)
  const handleUpdate = async (id) => {
    const newDept = prompt('Enter new department name:');
    if (!newDept) return;

    try {
      const response = await axios.put(`http://localhost:8000/api/employe/${id}`, {
        department: newDept,
      });
      alert('Employee updated successfully!');
      setEmployees((prev) =>
        prev.map((emp) => (emp._id === id ? response.data.employe : emp))
      );
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Failed to update employee.');
    }
  };

  // 🔹 Filtering by department
  const departments = ['All', ...new Set(employees.map((emp) => emp.department || ''))];
  const filteredEmployees =
    selectedDept === 'All'
      ? employees
      : employees.filter((emp) => emp.department === selectedDept);

  // 🔹 Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) return <p>Loading employees...</p>;

  return (
    <div className="container">
      <Header />
      <main className="manage-employee-main">
        <div className="manage-employee-box">
          <h2>MANAGE EMPLOYEE</h2>

          {/* Department Filter */}
          <div className="filter-container">
            <label htmlFor="dept-select">Select Dept.</label>
            <select id="dept-select" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>{dept || 'Unassigned'}</option>
              ))}
            </select>
          </div>

          {/* Employee Table */}
          <div className="employee-table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Name</th>
                  <th>Emp ID</th>
                  <th>Dept.</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((emp, index) => (
                  <tr key={emp._id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{`${emp.firstName} ${emp.lastName}`}</td>
                    <td>{emp.employeId}</td>
                    <td>{emp.department || 'N/A'}</td>
                    <td className="action-buttons">
                      <button className="update-btn" onClick={() => handleUpdate(emp._id)}>✏️</button>
                      <button className="delete-btn" onClick={() => handleDelete(emp._id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={currentPage === num ? 'active' : ''}
                onClick={() => setCurrentPage(num)}
              >
                {num}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              &gt;
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ManageEmployeePage;