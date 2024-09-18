import React, { useState, useEffect } from 'react';
import './EmployeeForm.css'; // Import the CSS file for the form

const EmployeeForm = ({ onClose, selectedEmployee}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    gender: '',
    course: [],
    image: null,
  });


  const [errors, setErrors] = useState({});
  const [emailExists, setEmailExists] = useState(false);



  // Use effect to pre-fill the form if `selectedEmployee` is passed (edit mode)
  useEffect(() => {
    if (selectedEmployee) {
      setFormData({
        name: selectedEmployee.name || '',
        email: selectedEmployee.email || '',
        mobile: selectedEmployee.mobile || '',
        designation: selectedEmployee.designation || '',
        gender: selectedEmployee.gender || '',
        course: selectedEmployee.course || [],
        image: selectedEmployee.image || null, // Assume image is the URL in case of editing
      });
    }
  }, [selectedEmployee]);


  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';

    if (!formData.mobile) newErrors.mobile = 'Mobile number is required';
    else if (!/^\d+$/.test(formData.mobile)) newErrors.mobile = 'Mobile number must be numeric';

    if (!formData.designation) newErrors.designation = 'Designation is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';

    if (formData.image && !/\.(jpg|png)$/i.test(formData.image.name)) {
      newErrors.image = 'Only JPG and PNG files are allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prevData => ({
        ...prevData,
        course: checked ? [...prevData.course, value] : prevData.course.filter(course => course !== value)
      }));
    } else if (type === 'file') {
      setFormData(prevData => ({
        ...prevData,
        image: e.target.files[0]
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    form.append('mobile', formData.mobile);
    form.append('designation', formData.designation);
    form.append('gender', formData.gender);
    form.append('course', formData.course.join(',')); // Convert array to comma-separated string
    console.log('Form Data:', formData); // Log form data before submission
    if (formData.image && typeof formData.image !== 'string') {
      form.append('image', formData.image); // Only append the file if it's not a URL (new file)
    }

    try {
      const url = selectedEmployee
        ? `http://localhost:5000/api/employees/${selectedEmployee._id}`
        : 'http://localhost:5000/api/employees';

      const method = selectedEmployee ? 'PUT' : 'POST'; // Use PUT for updating, POST for creating

      const response = await fetch(url, {
        method,
        body: form,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Employee created/updated:', data);

      setFormData({
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        course: [],
        image: null,
      });
      onClose(); // Close form after submission
    } catch (error) {
      console.error('Error creating/updating employee:', error);
    }
  };

  return (
    <div className="employee-form-overlay">
      <div className="employee-form-container">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Create Employee</h2>
        <form className="employee-form" onSubmit={handleFormSubmit}>

          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              required
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              required
            />
             {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile No:</label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleFormChange}
              required
            />
             {errors.mobile && <span className="error">{errors.mobile}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="designation">Designation:</label>
            <select
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleFormChange}
              required
            >
              <option value="">Select</option>
              <option value="Chief Executive Officer">Chief Executive Officer</option>
              <option value="Chief Financial Officer">Chief Financial Officer</option>
              <option value="Chief Technology Officer">Chief Technology Officer</option>
              <option value="Financial Analyst">Financial Analyst</option>
              <option value="Accountant">Accountant</option>
              <option value="Assistant Manager">Assistant Manager</option>
              <option value="Project Manager">Project Manager</option>
              <option value="General Manager">General Manager</option>
              <option value="Executive Officer">Executive Officer</option>
              <option value="Sales Manager">Sales Manager</option>
              <option value="Team Leader">Team Leader</option>
              <option value="President">President</option>
              <option value="Marketing Manager">Marketing Manager</option>
            </select>
            {errors.designation && <span className="error">{errors.designation}</span>}
          </div>

          <div className="form-group">
            <label>Gender:</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === 'Male'}
                  onChange={handleFormChange}
                  required
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === 'Female'}
                  onChange={handleFormChange}
                  required
                />
                Female
              </label>
            </div>
            {errors.gender && <span className="error">{errors.gender}</span>}
          </div>

          <div className="form-group">
            <label>Course:</label>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="course"
                  value="BCA"
                  checked={formData.course.includes('BCA')}
                  onChange={handleFormChange}
                />
                BCA
              </label>
              <label>
                <input
                  type="checkbox"
                  name="course"
                  value="MCA"
                  checked={formData.course.includes('MCA')}
                  onChange={handleFormChange}
                />
                MCA
              </label>
              <label>
                <input
                  type="checkbox"
                  name="course"
                  value="BCS"
                  checked={formData.course.includes('BCS')}
                  onChange={handleFormChange}
                />
                BCS
              </label>
              <label>
                <input
                  type="checkbox"
                  name="course"
                  value="B.Tech"
                  checked={formData.course.includes('B.Tech')}
                  onChange={handleFormChange}
                />
                B.Tech
              </label>
              <label>
                <input
                  type="checkbox"
                  name="course"
                  value="M.Tech"
                  checked={formData.course.includes('M.Tech')}
                  onChange={handleFormChange}
                />
                M.Tech
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image:</label>
            <input
              type="file"
              id="image"
              name="image"
              accept=".jpg,.png"
              onChange={handleFormChange}
              required
            />
             {/* Image preview for editing */}
               {errors.image && <span className="error">{errors.image}</span>}
               {formData.image && typeof formData.image === 'string' && (
                <div className="image-preview">
                <img src={`http://localhost:5000${formData.image}`} alt="Current" width="100" />
           </div>
             )}
          </div>

          <div className="form-group">
          <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
