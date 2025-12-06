import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UsersService from '../../../services/UsersService';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    first_name: '',
    last_name: '',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await UsersService.getAllUsers(filters);
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadUsers();
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await UsersService.deleteUser(userId);
        // Reload users after deletion
        loadUsers();
      } catch (err) {
        alert('Error deleting user: ' + err.message);
      }
    }
  };

  const getRoleBadge = (user) => {
    if (user.isAdmin) return <span className="badge badge-danger">Admin</span>;
    if (user.isTeacher) return <span className="badge badge-success">Teacher</span>;
    if (user.isAccountant) return <span className="badge badge-warning">Accountant</span>;
    return <span className="badge badge-secondary">Student</span>;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row page-titles mx-0">
        <div className="col-sm-6 p-md-0">
          <div className="welcome-text">
            <h4>All Users</h4>
            <span>Manage all system users</span>
          </div>
        </div>
        <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/dashboard">Home</Link></li>
            <li className="breadcrumb-item active">All Users</li>
          </ol>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Users Management</h4>
              <Link to="/users/create-user" className="btn btn-primary">
                <i className="fa fa-plus"></i> Create New User
              </Link>
            </div>
            <div className="card-body">
              {/* Search Filters */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="row">
                  <div className="col-md-4">
                    <input
                      type="text"
                      name="first_name"
                      className="form-control"
                      placeholder="Search by first name"
                      value={filters.first_name}
                      onChange={handleFilterChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      name="last_name"
                      className="form-control"
                      placeholder="Search by last name"
                      value={filters.last_name}
                      onChange={handleFilterChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <button type="submit" className="btn btn-primary me-2">
                      <i className="fa fa-search"></i> Search
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setFilters({ first_name: '', last_name: '' });
                        loadUsers();
                      }}
                      className="btn btn-secondary"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </form>

              {error && (
                <div className="alert alert-danger">
                  Error: {error}
                </div>
              )}

              {/* Users Table */}
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar avatar-sm mr-3">
                                <div className="avatar-title bg-primary text-white rounded-circle">
                                  {user.first_name ? user.first_name.charAt(0) : 'U'}
                                </div>
                              </div>
                              <div>
                                <h6 className="mb-0">{user.username}</h6>
                                <small className="text-muted">
                                  {user.first_name} {user.last_name}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>{getRoleBadge(user)}</td>
                          <td>
                            <span className="badge badge-success">Active</span>
                          </td>
                          <td>
                            <div className="d-flex">
                              <Link 
                                to={`/users/details/${user.id}`}
                                className="btn btn-sm btn-outline-primary me-2"
                                title="View Details"
                              >
                                <i className="fa fa-eye"></i>
                              </Link>
                              <Link 
                                to={`/users/edit/${user.id}`}
                                className="btn btn-sm btn-outline-warning me-2"
                                title="Edit User"
                              >
                                <i className="fa fa-edit"></i>
                              </Link>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="btn btn-sm btn-outline-danger"
                                title="Delete User"
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
