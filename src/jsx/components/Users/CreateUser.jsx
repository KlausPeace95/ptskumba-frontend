import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UsersService from '../../../services/UsersService';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    phone_number: '',
    is_staff: false,
    is_teacher: false,
    is_accountant: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await UsersService.createUser(formData);
      navigate('/users/all-users');
    } catch (error) {
      console.error('Error creating user:', error);
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row page-titles mx-0">
        <div className="col-sm-6 p-md-0">
          <div className="welcome-text">
            <h4>Create New User</h4>
            <span>Add a new user to the system</span>
          </div>
        </div>
        <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/dashboard">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/users/all-users">Users</Link></li>
            <li className="breadcrumb-item active">Create User</li>
          </ol>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">User Information</h4>
            </div>
            <div className="card-body">
              {errors.general && (
                <div className="alert alert-danger">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      className="form-control"
                      value={formData.phone_number}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      First Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="Enter first name"
                    />
                    {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Middle Name</label>
                    <input
                      type="text"
                      name="middle_name"
                      className="form-control"
                      value={formData.middle_name}
                      onChange={handleChange}
                      placeholder="Enter middle name"
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Last Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Enter last name"
                    />
                    {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">User Roles</label>
                  <div className="card border">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="is_staff"
                              id="is_staff"
                              checked={formData.is_staff}
                              onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="is_staff">
                              <strong>Admin</strong>
                              <br />
                              <small className="text-muted">Full system access</small>
                            </label>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="is_teacher"
                              id="is_teacher"
                              checked={formData.is_teacher}
                              onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="is_teacher">
                              <strong>Teacher</strong>
                              <br />
                              <small className="text-muted">Teaching privileges</small>
                            </label>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="is_accountant"
                              id="is_accountant"
                              checked={formData.is_accountant}
                              onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="is_accountant">
                              <strong>Accountant</strong>
                              <br />
                              <small className="text-muted">Financial management</small>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <small className="text-muted">
                    Note: Users without specific roles will be treated as students by default.
                  </small>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <Link to="/users/all-users" className="btn btn-secondary">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Creating...
                      </>
                    ) : (
                      'Create User'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">User Creation Guidelines</h5>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="fa fa-check text-success me-2"></i>
                  <strong>Custom Users:</strong> Active users without specific roles
                </li>
                <li className="mb-2">
                  <i className="fa fa-check text-success me-2"></i>
                  <strong>Role Assignment:</strong> Maximum of 1 specific role per user
                </li>
                <li className="mb-2">
                  <i className="fa fa-check text-success me-2"></i>
                  <strong>Email:</strong> Must be unique across the system
                </li>
                <li className="mb-2">
                  <i className="fa fa-info text-info me-2"></i>
                  Default password will be generated for new users
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
