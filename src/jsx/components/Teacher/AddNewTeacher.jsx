import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import { IMAGES } from '../Dashboard/Content';
import { createTeacher, updateTeacher, getTeacherById } from '../../../services/TeachersService';
import { AcademicService } from '../../../services/AcademicService';
import { useAuthStore } from '../../../store/store';
import axiosInstance from '../../../services/AxiosInstance';

const AddNewTeacher = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // For editing existing teacher
    const { token, user } = useAuthStore();
    const isEditing = Boolean(id);

    // Generate unique employment ID (max 8 characters)
    const generateEmploymentId = () => {
        const year = new Date().getFullYear().toString().slice(-2); // Last 2 digits of year
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // 3 digits
        return `EMP${year}${random}`; // Total: 6 characters (EMP + 2 + 3)
    };

    // Generate unique phone number
    const generateUniquePhoneNumber = () => {
        const baseNumber = "+237";
        const randomDigits = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
        return baseNumber + randomDigits;
    };

    // Generate short name from first and last name
    const generateShortName = () => {
        const firstName = formData.first_name.trim();
        const lastName = formData.last_name.trim();
        
        if (firstName && lastName) {
            // Take first letter of first name and first 2 letters of last name
            const shortName = (firstName.charAt(0) + lastName.substring(0, 2)).toUpperCase();
            return shortName;
        }
        return '';
    };

    // Form state
    const [formData, setFormData] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        empId: generateEmploymentId(), // Generate unique employment ID by default
        short_name: '',
        subject_specialization: [],
        address: '',
        gender: '',
        date_of_birth: new Date(1990, 0, 1), // Default to 1990-01-01 (past date)
        salary: '',
        national_id: '',
        nssf_number: '',
        tin_number: ''
    });

    // UI state
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});

    // Load subjects and teacher data (if editing)
    useEffect(() => {
        const loadData = async () => {
            try {
                // Load subjects
                const subjectsData = await AcademicService.getSubjects();
                setSubjects(subjectsData);
                console.log('✅ Available subjects loaded:', subjectsData);

                // Load teacher data if editing
                if (isEditing && id) {
                    const teacher = await getTeacherById(id);
                    setFormData({
                        first_name: teacher.first_name || '',
                        middle_name: teacher.middle_name || '',
                        last_name: teacher.last_name || '',
                        email: teacher.email || '',
                        phone_number: teacher.phone_number || '',
                        empId: teacher.empId || '',
                        short_name: teacher.short_name || '',
                        subject_specialization: teacher.subject_specialization_display || [],
                        address: teacher.address || '',
                        gender: teacher.gender || '',
                        date_of_birth: teacher.date_of_birth ? new Date(teacher.date_of_birth) : new Date(1990, 0, 1),
                        salary: teacher.salary || '',
                        national_id: teacher.national_id || '',
                        nssf_number: teacher.nssf_number || '',
                        tin_number: teacher.tin_number || ''
                    });
                }
            } catch (err) {
                console.error('❌ Error loading data:', err);
                setError('Failed to load form data: ' + (err.response?.data?.error || err.message));
            }
        };

        if (token && user) {
            loadData();
        }
    }, [id, isEditing, token, user]);

    const fileHandler = (e) => {       
        setFile(e.target.files[0]);		
    };

    const RemoveFile = () => {
        setFile(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear validation error for this field
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({ ...prev, date_of_birth: date }));
    };

    // Handle subject selection
    const handleSubjectChange = (e) => {
        const selectedSubjectNames = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => ({ ...prev, subject_specialization: selectedSubjectNames }));
        
        // Clear validation error for subject specialization
        if (validationErrors.subject_specialization) {
            setValidationErrors(prev => ({ ...prev, subject_specialization: null }));
        }
    };

    // Validation function
    const validateForm = () => {
        const errors = {};
        
        if (!formData.first_name.trim()) errors.first_name = 'First name is required';
        if (!formData.last_name.trim()) errors.last_name = 'Last name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        if (!formData.phone_number.trim()) errors.phone_number = 'Phone number is required';
        if (!formData.empId.trim()) errors.empId = 'Employment ID is required';
        if (!formData.short_name.trim()) errors.short_name = 'Short name is required';
        if (!formData.gender) errors.gender = 'Gender is required';
        if (!formData.salary) errors.salary = 'Salary is required';
        if (formData.subject_specialization.length === 0) errors.subject_specialization = 'At least one subject specialization is required';
        
        // Validate email format
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        // Validate phone number format
        if (formData.phone_number && !/^\+?[1-9]\d{1,14}$/.test(formData.phone_number.replace(/\s/g, ''))) {
            errors.phone_number = 'Please enter a valid phone number';
        }
        
        // Validate salary
        if (formData.salary && (isNaN(formData.salary) || formData.salary <= 0)) {
            errors.salary = 'Please enter a valid salary amount';
        }
        
        // Validate employee ID length (max 8 characters)
        if (formData.empId && formData.empId.length > 8) {
            errors.empId = 'Employment ID must be 8 characters or less';
        }
        
        // Validate date of birth (should be in the past)
        if (formData.date_of_birth && formData.date_of_birth > new Date()) {
            errors.date_of_birth = 'Date of birth must be in the past';
        }
        
        // Validate subject specialization
        if (formData.subject_specialization.length === 0) {
            errors.subject_specialization = 'At least one subject specialization is required';
        }
        
        // Validate short name
        if (!formData.short_name.trim()) {
            errors.short_name = 'Short name is required';
        } else if (formData.short_name.trim().length < 2) {
            errors.short_name = 'Short name must be at least 2 characters';
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setError('Please correct the errors in the form');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            // Prepare data for submission
            const submissionData = {
                ...formData,
                date_of_birth: formData.date_of_birth.toISOString().split('T')[0], // Format as YYYY-MM-DD
                salary: parseFloat(formData.salary) // Convert to number
            };

            // Debug: Log the data being sent
            console.log('🔍 Teacher form data being submitted:', submissionData);
            console.log('🔍 Email value:', submissionData.email);
            console.log('🔍 Phone value:', submissionData.phone_number);
            console.log('🔍 Employment ID:', submissionData.empId);
            console.log('🔍 Date of birth:', submissionData.date_of_birth);
            console.log('🔍 Subject specialization:', submissionData.subject_specialization);
            console.log('🔍 Gender:', submissionData.gender);
            console.log('🔍 Salary:', submissionData.salary);
            console.log('🔍 Available subjects:', subjects);
            console.log('🔍 Subject specialization type:', typeof submissionData.subject_specialization);
            console.log('🔍 Subject specialization length:', submissionData.subject_specialization.length);

            let result;
            if (isEditing) {
                result = await updateTeacher(id, submissionData);
                setSuccess('Teacher updated successfully!');
            } else {
                result = await createTeacher(submissionData);
                setSuccess('Teacher created successfully!');
            }

            console.log('✅ Teacher operation successful:', result);
            
            // Redirect after successful operation
            setTimeout(() => {
                navigate('/teachers');
            }, 2000);

        } catch (err) {
            console.error('❌ Error saving teacher:', err);
            
            // Handle validation errors from backend
            if (err.response?.data) {
                if (typeof err.response.data === 'object' && err.response.data.detail) {
                    setValidationErrors(err.response.data.detail);
                    
                    // Show specific error messages
                    let errorMessage = 'Please correct the following errors:\n';
                    Object.keys(err.response.data.detail).forEach(key => {
                        errorMessage += `• ${key}: ${err.response.data.detail[key].join(', ')}\n`;
                    });
                    setError(errorMessage);
                } else {
                    setError(err.response.data.error || err.response.data.message || 'Validation failed');
                }
            } else {
                setError('Failed to save teacher. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAsDraft = () => {
        // For now, just save as normal
        handleSubmit({ preventDefault: () => {} });
    };

    return (
        <div className="container-fluid">
            {/* Loading Overlay */}
            {loading && (
                <div className="row">
                    <div className="col-12">
                        <div className="alert alert-info">
                            <div className="d-flex align-items-center">
                                <div className="spinner-border spinner-border-sm me-3" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <div>
                                    {isEditing ? 'Updating teacher...' : 'Creating teacher...'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="row">
                    <div className="col-12">
                        <div className="alert alert-success alert-dismissible">
                            <i className="fas fa-check me-2"></i>{success}
                        </div>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="row">
                    <div className="col-12">
                        <div className="alert alert-danger alert-dismissible">
                            <i className="fas fa-exclamation-triangle me-2"></i>{error}
                        </div>
                    </div>
                </div>
            )}

            {/* Debug Information */}
            {subjects.length > 0 && (
                <div className="row">
                    <div className="col-12">
                        <div className="alert alert-info">
                            <h6>🔍 Debug: Available Subjects ({subjects.length})</h6>
                            <div className="d-flex flex-wrap gap-1">
                                {subjects.slice(0, 10).map((subject, index) => (
                                    <span key={index} className="badge bg-secondary">
                                        {subject.name}
                                    </span>
                                ))}
                                {subjects.length > 10 && (
                                    <span className="badge bg-light text-dark">
                                        +{subjects.length - 10} more
                                    </span>
                                )}
                            </div>
                            <div className="mt-2">
                                <small className="text-muted">
                                    <strong>Selected subjects:</strong> {formData.subject_specialization.length > 0 ? 
                                        formData.subject_specialization.join(', ') : 'None selected'}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Test Button */}
            <div className="row">
                <div className="col-12">
                    <div className="alert alert-warning">
                        <h6>🧪 Test Teacher Creation</h6>
                        <p className="mb-2">Click this button to test teacher creation with safe default values:</p>
                        <div className="d-flex gap-2">
                            <button 
                                type="button"
                                className="btn btn-warning btn-sm"
                                onClick={async () => {
                                    try {
                                        const testData = {
                                            first_name: 'Test',
                                            last_name: 'Teacher',
                                            email: `test.${Date.now()}@example.com`,
                                            phone_number: `+237${Date.now().toString().slice(-8)}`,
                                            empId: `T${Date.now().toString().slice(-5)}`,
                                            short_name: 'TT',
                                            subject_specialization: subjects.length > 0 ? [subjects[0].name] : ['Mathematics'],
                                            address: 'Test Address',
                                            gender: 'Male',
                                            date_of_birth: '1990-01-01',
                                            salary: 100000
                                        };
                                        
                                        console.log('🧪 Testing with data:', testData);
                                        const response = await axiosInstance.post('/users/teachers/', testData);
                                        console.log('✅ Test successful:', response.data);
                                        alert('Test teacher created successfully!');
                                    } catch (error) {
                                        console.error('❌ Test failed:', error.response?.data);
                                        alert('Test failed: ' + (error.response?.data?.detail || error.message));
                                    }
                                }}
                            >
                                Test with Subject Names
                            </button>
                            
                            <button 
                                type="button"
                                className="btn btn-info btn-sm"
                                onClick={async () => {
                                    try {
                                        const testData = {
                                            first_name: 'Test',
                                            last_name: 'Teacher',
                                            email: `test.${Date.now()}@example.com`,
                                            phone_number: `+237${Date.now().toString().slice(-8)}`,
                                            empId: `T${Date.now().toString().slice(-5)}`,
                                            short_name: 'TT',
                                            subject_specialization: subjects.length > 0 ? [subjects[0].id] : [1],
                                            address: 'Test Address',
                                            gender: 'Male',
                                            date_of_birth: '1990-01-01',
                                            salary: 100000
                                        };
                                        
                                        console.log('🧪 Testing with IDs:', testData);
                                        const response = await axiosInstance.post('/users/teachers/', testData);
                                        console.log('✅ Test successful:', response.data);
                                        alert('Test teacher created successfully!');
                                    } catch (error) {
                                        console.error('❌ Test failed:', error.response?.data);
                                        alert('Test failed: ' + (error.response?.data?.detail || error.message));
                                    }
                                }}
                            >
                                Test with Subject IDs
                            </button>
                            
                            <button 
                                type="button"
                                className="btn btn-success btn-sm"
                                onClick={async () => {
                                    try {
                                        const testData = {
                                            first_name: 'Test',
                                            last_name: 'Teacher',
                                            email: `test.${Date.now()}@example.com`,
                                            phone_number: `+237${Date.now().toString().slice(-8)}`,
                                            empId: `T${Date.now().toString().slice(-5)}`,
                                            short_name: 'TT',
                                            address: 'Test Address',
                                            gender: 'Male',
                                            date_of_birth: '1990-01-01',
                                            salary: 100000
                                        };
                                        
                                        console.log('🧪 Testing without subjects:', testData);
                                        const response = await axiosInstance.post('/users/teachers/', testData);
                                        console.log('✅ Test successful:', response.data);
                                        alert('Test teacher created successfully!');
                                    } catch (error) {
                                        console.error('❌ Test failed:', error.response?.data);
                                        alert('Test failed: ' + (error.response?.data?.detail || error.message));
                                    }
                                }}
                            >
                                Test without Subjects
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header">
                                <h5 className="mb-0">{isEditing ? 'Edit Teacher Details' : 'Add New Teacher'}</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-xl-3 col-lg-4">
                                        <label className="form-label text-primary">Photo</label>
                                        <div className="avatar-upload">
                                        <div className="avatar-preview">
                                            <div id="imagePreview"                                                 
                                                style={{backgroundImage: file ? "url(" + URL.createObjectURL(file) + ")" : "url(" + IMAGES.noimage +")" }}
                                            > 			
                                            </div>
                                        </div>
                                        <div className="change-btn mt-2 mb-lg-0 mb-3">
                                                <input type='file' className="form-control d-none" onChange={fileHandler} id="imageUpload" accept=".png, .jpg, .jpeg" />
                                            <label htmlFor="imageUpload" className="dlab-upload mb-0 btn btn-primary btn-sm">Choose File</label>
                                            <Link to={"#"} className="btn btn-danger light remove-img ms-2 btn-sm" onClick={RemoveFile}>Remove</Link>
                                        </div>
                                    </div>
                                    </div>
                                    
                                <div className="col-xl-9 col-lg-8">
                                    <div className="row">
                                        <div className="col-xl-6 col-sm-6">
                                            {/* First Name */}
                                    <div className="mb-3">
                                                <label className="form-label text-primary">First Name<span className="required">*</span></label>
                                                <input 
                                                    type="text" 
                                                    name="first_name"
                                                    className={`form-control ${validationErrors.first_name ? 'is-invalid' : ''}`}
                                                    value={formData.first_name}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter first name" 
                                                />
                                                {validationErrors.first_name && (
                                                    <div className="invalid-feedback">{validationErrors.first_name}</div>
                                                )}
                                    </div>

                                            {/* Email */}
                                    <div className="mb-3">
                                                <label className="form-label text-primary">Email<span className="required">*</span></label>
                                                <input 
                                                    type="email" 
                                                    name="email"
                                                    className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="teacher@example.com" 
                                                />
                                                {validationErrors.email && (
                                                    <div className="invalid-feedback">{validationErrors.email}</div>
                                                )}
                                    </div>

                                            {/* Employment ID */}
                                    <div className="mb-3">
                                                <label className="form-label text-primary">Employment ID<span className="required">*</span></label>
                                                <div className="input-group">
                                                    <input 
                                                        type="text" 
                                                        name="empId"
                                                        className={`form-control ${validationErrors.empId ? 'is-invalid' : ''}`}
                                                        value={formData.empId}
                                                        onChange={handleInputChange}
                                                        placeholder="e.g., EMP25001" 
                                                        maxLength="8"
                                                    />
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => setFormData(prev => ({ ...prev, empId: generateEmploymentId() }))}
                                                        title="Generate unique employment ID"
                                                    >
                                                        <i className="fas fa-sync-alt"></i>
                                                    </button>
                                                </div>
                                                <small className="form-text text-muted">
                                                    Max 8 characters. Current: {formData.empId.length}/8
                                                    {formData.empId.length > 8 && (
                                                        <span className="text-danger ms-2">⚠️ Too long!</span>
                                                    )}
                                                </small>
                                                {validationErrors.empId && (
                                                    <div className="invalid-feedback">{validationErrors.empId}</div>
                                                )}
                                            </div>

                                            {/* Gender */}
                                            <div className="mb-3">
                                                <label className="form-label text-primary">Gender<span className="required">*</span></label>
                                                <select 
                                                    name="gender"
                                                    className={`form-control ${validationErrors.gender ? 'is-invalid' : ''}`}
                                                    value={formData.gender}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>
                                                {validationErrors.gender && (
                                                    <div className="invalid-feedback">{validationErrors.gender}</div>
                                                )}
                                            </div>

                                            {/* Subject Specialization */}
                                            <div className="mb-3">
                                                <label className="form-label text-primary">Subject Specialization<span className="required">*</span></label>
                                                <select 
                                                    name="subject_specialization"
                                                    className={`form-control ${validationErrors.subject_specialization ? 'is-invalid' : ''}`}
                                                    value={formData.subject_specialization}
                                                    onChange={handleSubjectChange}
                                                    multiple
                                                    size="5"
                                                    style={{minHeight: '120px'}}
                                                >
                                                    <option value="" disabled>Select subjects (hold Ctrl/Cmd for multiple)</option>
                                                    {subjects.map((subject) => (
                                                        <option key={subject.id} value={subject.name}>
                                                            {subject.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="d-flex justify-content-between align-items-center mt-1">
                                                    <small className="form-text text-muted">
                                                        Hold Ctrl/Cmd to select multiple subjects. Selected: {formData.subject_specialization.length} subject(s)
                                                    </small>
                                                    {formData.subject_specialization.length > 0 && (
                                                        <button 
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => setFormData(prev => ({ ...prev, subject_specialization: [] }))}
                                                        >
                                                            Clear All
                                                        </button>
                                                    )}
                                                </div>
                                                {validationErrors.subject_specialization && (
                                                    <div className="invalid-feedback">{validationErrors.subject_specialization}</div>
                                                )}
                                                                                                {formData.subject_specialization.length > 0 && (
                                                    <div className="mt-2">
                                                        <strong>Selected subjects:</strong>
                                                        <div className="d-flex flex-wrap gap-1 mt-1">
                                                            {formData.subject_specialization.map((subjectName, index) => (
                                                                <span key={index} className="badge bg-primary">
                                                                    {subjectName}
                                                                    <button 
                                                                        type="button"
                                                                        className="btn-close btn-close-white ms-1"
                                                                        style={{fontSize: '0.7em'}}
                                                                        onClick={() => {
                                                                            const newSubjects = formData.subject_specialization.filter(s => s !== subjectName);
                                                                            setFormData(prev => ({ ...prev, subject_specialization: newSubjects }));
                                                                        }}
                                                                    ></button>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                    </div>                                      
                                </div>

                                <div className="col-xl-6 col-sm-6">
                                            {/* Last Name */}
                                            <div className="mb-3">
                                                <label className="form-label text-primary">Last Name<span className="required">*</span></label>
                                                <input 
                                                    type="text" 
                                                    name="last_name"
                                                    className={`form-control ${validationErrors.last_name ? 'is-invalid' : ''}`}
                                                    value={formData.last_name}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter last name" 
                                                />
                                                {validationErrors.last_name && (
                                                    <div className="invalid-feedback">{validationErrors.last_name}</div>
                                                )}
                                            </div>

                                            {/* Phone Number */}
                                    <div className="mb-3">
                                                <label className="form-label text-primary">Phone Number<span className="required">*</span></label>
                                                <div className="input-group">
                                                    <input 
                                                        type="tel" 
                                                        name="phone_number"
                                                        className={`form-control ${validationErrors.phone_number ? 'is-invalid' : ''}`}
                                                        value={formData.phone_number}
                                                        onChange={handleInputChange}
                                                        placeholder="+237123456789" 
                                                    />
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => setFormData(prev => ({ ...prev, phone_number: generateUniquePhoneNumber() }))}
                                                        title="Generate unique phone number"
                                                    >
                                                        <i className="fas fa-sync-alt"></i>
                                                    </button>
                                                </div>
                                                {validationErrors.phone_number && (
                                                    <div className="invalid-feedback">{validationErrors.phone_number}</div>
                                                )}
                                    </div>

                                            {/* Short Name */}
                                    <div className="mb-3">
                                                <label className="form-label text-primary">Short Name<span className="required">*</span></label>
                                                <div className="input-group">
                                                    <input 
                                                        type="text" 
                                                        name="short_name"
                                                        className={`form-control ${validationErrors.short_name ? 'is-invalid' : ''}`}
                                                        value={formData.short_name}
                                                        onChange={handleInputChange}
                                                        placeholder="e.g., JDO" 
                                                        maxLength="10"
                                                    />
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => setFormData(prev => ({ ...prev, short_name: generateShortName() }))}
                                                        title="Generate short name from first and last name"
                                                        disabled={!formData.first_name.trim() || !formData.last_name.trim()}
                                                    >
                                                        <i className="fas fa-sync-alt"></i>
                                                    </button>
                                                </div>
                                                {validationErrors.short_name && (
                                                    <div className="invalid-feedback">{validationErrors.short_name}</div>
                                                )}
                                    </div>

                                            {/* Date of Birth */}
                                    <div className="mb-3">
                                                <label className="form-label text-primary">Date of Birth</label>
                                                <DatePicker
                                                    selected={formData.date_of_birth}
                                                    onChange={handleDateChange}
                                                    dateFormat="yyyy-MM-dd"
                                                    className="form-control"
                                                    placeholderText="Select date of birth"
                                                    maxDate={new Date()}
                                                />
                                            </div>

                                            {/* Salary */}
                                            <div className="mb-3">
                                                <label className="form-label text-primary">Salary<span className="required">*</span></label>
                                                <input 
                                                    type="number" 
                                                    name="salary"
                                                    className={`form-control ${validationErrors.salary ? 'is-invalid' : ''}`}
                                                    value={formData.salary}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter salary amount" 
                                                    min="0"
                                                    step="1000"
                                                />
                                                {validationErrors.salary && (
                                                    <div className="invalid-feedback">{validationErrors.salary}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Fields Row */}
                                    <div className="row">
                                        <div className="col-xl-4 col-sm-6">
                                            {/* Middle Name */}
                                    <div className="mb-3">
                                                <label className="form-label text-primary">Middle Name</label>
                                                <input 
                                                    type="text" 
                                                    name="middle_name"
                                                    className="form-control"
                                                    value={formData.middle_name}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter middle name" 
                                                />
                                    </div>
                                </div>
                                        <div className="col-xl-4 col-sm-6">
                                            {/* Address */}
                                            <div className="mb-3">
                                                <label className="form-label text-primary">Address</label>
                                                <input 
                                                    type="text" 
                                                    name="address"
                                                    className="form-control"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter address" 
                                                />
                            </div>
                        </div>
                                        <div className="col-xl-4 col-sm-6">
                                            {/* National ID */}
                                            <div className="mb-3">
                                                <label className="form-label text-primary">National ID</label>
                                                <input 
                                                    type="text" 
                                                    name="national_id"
                                                    className="form-control"
                                                    value={formData.national_id}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter national ID" 
                                                />
                    </div>
                </div>
            </div>

                                    {/* Additional Fields Row 2 */}
                        <div className="row">
                                        <div className="col-xl-4 col-sm-6">
                                            {/* NSSF Number */}
                                <div className="mb-3">
                                                <label className="form-label text-primary">NSSF Number</label>
                                                <input 
                                                    type="text" 
                                                    name="nssf_number"
                                                    className="form-control"
                                                    value={formData.nssf_number}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter NSSF number" 
                                                />
                                            </div>                                             
                                        </div>
                                        <div className="col-xl-4 col-sm-6">
                                            {/* TIN Number */}
                                            <div className="mb-3">
                                                <label className="form-label text-primary">TIN Number</label>
                                                <input 
                                                    type="text" 
                                                    name="tin_number"
                                                    className="form-control"
                                                    value={formData.tin_number}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter TIN number" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                                </div>
                {/* Form Actions */}
                <div className="row">
                    <div className="col-12">
                <div className="card">
                    <div className="card-body">
                                <div className="text-end">
                                    <Link to="/teachers" className="btn btn-secondary me-3">
                                        <i className="fas fa-arrow-left me-2"></i>Cancel
                                    </Link>
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-primary me-3"
                                        onClick={handleSaveAsDraft}
                                        disabled={loading}
                                    >
                                        <i className="fas fa-save me-2"></i>Save as Draft
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <><i className="fas fa-spinner fa-spin me-2"></i>Saving...</>
                                        ) : (
                                            <><i className="fas fa-check me-2"></i>{isEditing ? 'Update Teacher' : 'Create Teacher'}</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </form>
        </div>
    );
};

export default AddNewTeacher;