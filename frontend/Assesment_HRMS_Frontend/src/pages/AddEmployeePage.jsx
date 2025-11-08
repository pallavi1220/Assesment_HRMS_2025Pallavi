import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../axios';
import Header from '../componets/Header';
import Footer from '../componets/Footer';
import './css/AddEmployeePage.css';

const AddEmployeePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    doj: '',
    dept: '',
    proj: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Authentication check
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('role');

  if (!isAuthenticated || userRole !== 'HR') {
    setTimeout(() => {
      alert("Please login as HR to access this page.");
      navigate('/login');
    }, 100);
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (localStorage.getItem('isLoggedIn') !== 'true' || localStorage.getItem('role') !== 'HR') {
      alert("Session expired. Please login again.");
      navigate('/login');
      return;
    }

    // Validate form inputs
    if (!formData.name || !formData.doj || !formData.dept || !formData.proj) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken');

      // Split full name into first and last name
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Generate random 6-digit password
      const generatedPassword = Math.floor(100000 + Math.random() * 900000).toString();

      // Prepare payload for backend
      const payload = {
        firstName,
        lastName,
        employeId: formData.code || '', // backend will auto-generate if empty
        password: generatedPassword,
        department: formData.dept,
        project: formData.proj,
        dateOfJoining: formData.doj,
      };

      // Send data to backend
      const response = await API.post('/addEmploye', payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        alert(
          `✅Employee added successfully!\n\n` +
          `Employee ID: ${response.data.employe.employeId}\n` +
          `Password: ${generatedPassword}`
        );

        // Reset form and redirect
        setFormData({ name: '', code: '', doj: '', dept: '', proj: '' });
        navigate('/manage-employee');
      } else {
        throw new Error(response.data.message || 'Backend failed');
      }

    } catch (error) {
      console.error('Backend Error:', error);
      alert(' Error adding employee. Please check console or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <Header />
      <main className="add-employee-main">
        <div className="add-employee-box">
          <h2>ADD EMPLOYEE</h2>

          <form className="add-employee-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="emp-name">Emp Name *</label>
              <input
                type="text"
                id="emp-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter full name (e.g. John Doe)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="emp-id">Emp ID/Code *</label>
              <input
                type="text"
                id="emp-id"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Enter employee code (optional)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="doj">Date of Joining *</label>
              <input
                type="date"
                id="doj"
                name="doj"
                value={formData.doj}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dept">Department *</label>
              <input
                type="text"
                id="dept"
                name="dept"
                value={formData.dept}
                onChange={handleChange}
                required
                placeholder="Enter department"
              />
            </div>

            <div className="form-group">
              <label htmlFor="proj">Project *</label>
              <input
                type="text"
                id="proj"
                name="proj"
                value={formData.proj}
                onChange={handleChange}
                required
                placeholder="Enter project name"
              />
            </div>

            <button type="submit" className="add-emp-btn" disabled={isLoading}>
              {isLoading ? 'Saving to Database...' : 'ADD EMPLOYEE'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddEmployeePage;
