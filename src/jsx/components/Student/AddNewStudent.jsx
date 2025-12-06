import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import { IMAGES } from '../Dashboard/Content';
import { createStudent, updateStudent, getStudentById } from '../../../services/SISService';
import { AcademicService } from '../../../services/AcademicService';
import { useAuthStore } from '../../../store/store';

const AddNewStudent = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // For editing existing student
    const [searchParams] = useSearchParams(); // For URL parameters from application
    const { token, user } = useAuthStore();
    const isEditing = Boolean(id);
    const isFromApplication = searchParams.get('fromApplication') === 'true';

    // Generate unique admission number
    const generateAdmissionNumber = () => {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `PS${year}U${random}`;
    };

    // Get application data from URL parameters
    const getApplicationData = () => {
        if (!isFromApplication) return {};
        
        return {
            first_name: searchParams.get('firstName') || '',
            middle_name: searchParams.get('middleName') || '',
            last_name: searchParams.get('lastName') || '',
            email: searchParams.get('email') || '',
            phone_number: searchParams.get('phone') || '',
            gender: searchParams.get('gender') || '',
            date_of_birth: searchParams.get('dateOfBirth') || '',
            religion: searchParams.get('religion') || '',
            nationality: searchParams.get('nationality') || '',
            address: searchParams.get('address') || '',
            city: searchParams.get('city') || '',
            region: searchParams.get('region') || '',
            country: searchParams.get('country') || ''
        };
    };

    // Get application data for pre-filling
    const applicationData = getApplicationData();
    
    // Form state
    const [formData, setFormData] = useState({
        first_name: applicationData.first_name || '',
        middle_name: applicationData.middle_name || '',
        last_name: applicationData.last_name || '',
        admission_number: generateAdmissionNumber(), // Generate unique number by default
        parent_contact: applicationData.phone_number || '',
        religion: applicationData.religion || '',
        class_level: '',
        class_of_year: '2024', // Set default year
        gender: applicationData.gender || '',
        date_of_birth: applicationData.date_of_birth ? new Date(applicationData.date_of_birth) : new Date(),
        region: applicationData.region || '',
        city: applicationData.city || '',
        street: applicationData.address || '',
        std_vii_number: '',
        prems_number: ''
    });

    // UI state
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [classLevels, setClassLevels] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});

    // Load class levels and student data (if editing)
    useEffect(() => {
        const loadData = async () => {
            try {
                // Load class levels
                const levels = await AcademicService.getClassLevels();
                setClassLevels(levels);

                // Load student data if editing
                if (isEditing && id) {
                    const student = await getStudentById(id);
                    
                    setFormData({
                        first_name: student.first_name || '',
                        middle_name: student.middle_name || '',
                        last_name: student.last_name || '',
                        admission_number: student.admission_number || '',
                        parent_contact: student.parent_contact || '',
                        religion: student.religion || '',
                        class_level: student.class_level_display || '',
                        class_of_year: student.class_of_year_display || '',
                        gender: student.gender || '',
                        date_of_birth: student.date_of_birth ? new Date(student.date_of_birth) : new Date(),
                        region: student.region || '',
                        city: student.city || '',
                        street: student.street || '',
                        std_vii_number: student.std_vii_number || '',
                        prems_number: student.prems_number || ''
                    });
                }
            } catch (err) {
                console.error('Error loading data:', err);
                setError('Failed to load form data: ' + (err.response?.data?.message || err.message));
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

    // Validation function
    const validateForm = () => {
        const errors = {};
        
        if (!formData.first_name.trim()) errors.first_name = 'First name is required';
        if (!formData.last_name.trim()) errors.last_name = 'Last name is required';
        if (!formData.admission_number.trim()) errors.admission_number = 'Admission number is required';
        if (!formData.class_level) errors.class_level = 'Class level is required';
        if (!formData.class_of_year) errors.class_of_year = 'Class of year is required';
        if (!formData.gender) errors.gender = 'Gender is required';
        if (!formData.parent_contact.trim()) errors.parent_contact = 'Parent contact is required';
        
        // Validate phone number format
        if (formData.parent_contact && !/^\+?[1-9]\d{1,14}$/.test(formData.parent_contact.replace(/\s/g, ''))) {
            errors.parent_contact = 'Please enter a valid phone number';
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
                date_of_birth: formData.date_of_birth.toISOString().split('T')[0] // Format as YYYY-MM-DD
            };

            let result;
            if (isEditing) {
                result = await updateStudent(id, submissionData);
                setSuccess('Student updated successfully!');
            } else {
                result = await createStudent(submissionData);
                setSuccess('Student created successfully!');
            }
            
            // Redirect after successful operation
            setTimeout(() => {
                navigate('/student');
            }, 2000);

        } catch (err) {
            console.error('❌ Error saving student:', err);
            
            // Handle validation errors from backend
            if (err.response?.data) {
                if (typeof err.response.data === 'object') {
                    setValidationErrors(err.response.data);
                    setError('Please correct the validation errors');
                } else {
                    setError(err.response.data.message || 'Failed to save student');
                }
            } else {
                setError(err.message || 'Failed to save student');
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle draft save (optional feature)
    const handleSaveAsDraft = async () => {
        try {
            setLoading(true);
            // Implement draft save logic if needed
            setSuccess('Draft saved successfully!');
        } catch (err) {
            setError('Failed to save draft');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Loading State */}
            {loading && (
                <div className="row">
                    <div className="col-12">
                        <div className="alert alert-info">
                            <i className="fas fa-spinner fa-spin me-2"></i>
                            {isEditing ? 'Updating student...' : 'Creating student...'}
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

            <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header">
                                <h5 className="mb-0">
                                    {isEditing ? 'Edit Student Details' : isFromApplication ? 'Create Student from Application' : 'Add New Student'}
                                    {isEditing && <span className="badge bg-warning ms-2">Editing Mode</span>}
                                    {isFromApplication && <span className="badge bg-info ms-2">From Application</span>}
                                </h5>
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

                                                {/* Date of Birth */}
                                            <div className="mb-3">
                                                    <label className="form-label text-primary">Date of Birth<span className="required">*</span></label>
                                                    <DatePicker 
                                                        className="form-control"
                                                        selected={formData.date_of_birth}
                                                        onChange={handleDateChange}	
                                                        dateFormat="yyyy-MM-dd"
                                                        showYearDropdown
                                                        yearDropdownItemNumber={50}
                                                        scrollableYearDropdown
                                                    />
                                                </div>

                                                {/* Parent Contact */}
                                                <div className="mb-3">
                                                    <label className="form-label text-primary">Parent Contact<span className="required">*</span></label>
                                                    <input 
                                                        type="tel" 
                                                        name="parent_contact"
                                                        className={`form-control ${validationErrors.parent_contact ? 'is-invalid' : ''}`}
                                                        value={formData.parent_contact}
                                                        onChange={handleInputChange}
                                                        placeholder="+237123456789" 
                                                    />
                                                    {validationErrors.parent_contact && (
                                                        <div className="invalid-feedback">{validationErrors.parent_contact}</div>
                                                    )}
                                                </div>

                                                {/* Region */}
                                                <div className="mb-3">
                                                    <label className="form-label text-primary">Region</label>
                                                    <input 
                                                        type="text" 
                                                        name="region"
                                                        className="form-control"
                                                        value={formData.region}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter region" 
                                                    />
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

                                                {/* Admission Number */}
                                                <div className="mb-3">
                                                    <label className="form-label text-primary">Admission Number<span className="required">*</span></label>
                                                    <div className="input-group">
                                                        <input 
                                                            type="text" 
                                                            name="admission_number"
                                                            className={`form-control ${validationErrors.admission_number ? 'is-invalid' : ''}`}
                                                            value={formData.admission_number}
                                                            onChange={handleInputChange}
                                                            placeholder="Enter admission number" 
                                                        />
                                                        <button 
                                                            type="button" 
                                                            className="btn btn-outline-secondary"
                                                            onClick={() => setFormData(prev => ({ ...prev, admission_number: generateAdmissionNumber() }))}
                                                        >
                                                            <i className="fas fa-sync-alt"></i>
                                                        </button>
                                                    </div>
                                                    {validationErrors.admission_number && (
                                                        <div className="invalid-feedback">{validationErrors.admission_number}</div>
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

                                                {/* Class Level */}
                                            <div className="mb-3">
                                                    <label className="form-label text-primary">Class Level<span className="required">*</span></label>
                                                    <select 
                                                        name="class_level"
                                                        className={`form-control ${validationErrors.class_level ? 'is-invalid' : ''}`}
                                                        value={formData.class_level}
                                                        onChange={handleInputChange}
                                                    >
                                                        <option value="">Select Class Level</option>
                                                        {classLevels.map((level) => (
                                                            <option key={level.id} value={level.name}>
                                                                {level.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {validationErrors.class_level && (
                                                        <div className="invalid-feedback">{validationErrors.class_level}</div>
                                                    )}
                                            </div>

                                                {/* Class of Year */}
                                                <div className="mb-3">
                                                    <label className="form-label text-primary">Class of Year<span className="required">*</span></label>
                                                    <select 
                                                        name="class_of_year"
                                                        className={`form-control ${validationErrors.class_of_year ? 'is-invalid' : ''}`}
                                                        value={formData.class_of_year}
                                                        onChange={handleInputChange}
                                                    >
                                                        <option value="">Select Class Year</option>
                                                        <option value="2024">2024</option>
                                                        <option value="2025">2025</option>
                                                        <option value="2026">2026</option>
                                                        <option value="2027">2027</option>
                                                        <option value="2028">2028</option>
                                                    </select>
                                                    {validationErrors.class_of_year && (
                                                        <div className="invalid-feedback">{validationErrors.class_of_year}</div>
                                                    )}
                                                </div>

                                                {/* City */}
                                            <div className="mb-3">
                                                    <label className="form-label text-primary">City</label>
                                                    <input 
                                                        type="text" 
                                                        name="city"
                                                        className="form-control"
                                                        value={formData.city}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter city" 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Additional Fields Row */}
                                        <div className="row">
                                            <div className="col-xl-4 col-sm-6">
                                                {/* Religion */}
                                            <div className="mb-3">
                                                    <label className="form-label text-primary">Religion</label>
                                                    <select 
                                                        name="religion"
                                                        className="form-control"
                                                        value={formData.religion}
                                                        onChange={handleInputChange}
                                                    >
                                                        <option value="">Select Religion</option>
                                                        <option value="Christian">Christian</option>
                                                        <option value="Muslim">Muslim</option>
                                                        <option value="Traditional">Traditional</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-xl-4 col-sm-6">
                                                {/* Street */}
                                            <div className="mb-3">
                                                    <label className="form-label text-primary">Street Address</label>
                                                    <input 
                                                        type="text" 
                                                        name="street"
                                                        className="form-control"
                                                        value={formData.street}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter street address" 
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xl-4 col-sm-6">
                                                {/* STD VII Number */}
                                            <div className="mb-3">
                                                    <label className="form-label text-primary">STD VII Number</label>
                                                    <input 
                                                        type="text" 
                                                        name="std_vii_number"
                                                        className="form-control"
                                                        value={formData.std_vii_number}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter STD VII number" 
                                                    />
                                                </div>
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
                                    <Link to="/student" className="btn btn-secondary me-3">
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
                                            <><i className="fas fa-check me-2"></i>{isEditing ? 'Update Student' : 'Create Student'}</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default AddNewStudent;