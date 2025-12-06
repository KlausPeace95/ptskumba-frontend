import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    getPrograms, 
    createMyApplication, 
    updateMyApplication, 
    submitMyApplication 
} from '../../../services/ApplicationService';
import Logo from '../../../assets/custom/church-logo.jpeg';

const ApplicationForm = () => {
    const navigate = useNavigate();
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [currentStep, setCurrentStep] = useState(1);
    const [editMode, setEditMode] = useState(false);
    const [applicationId, setApplicationId] = useState(null);
    
    const [formData, setFormData] = useState({
        // Application reference
        program: '',
        
        // Personal Information
        first_name: '',
        middle_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        nationality: '',
        marital_status: '',
        
        // Contact Information
        email: '',
        phone_number: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state_province: '',
        postal_code: '',
        country: '',
        
        // Emergency Contact
        emergency_contact_name: '',
        emergency_contact_phone: '',
        emergency_contact_relationship: '',
        
        // Academic Background
        previous_education: '',
        current_church_affiliation: '',
        pastoral_experience: '',
        
        // Application Documents
        transcript: null,
        personal_statement: null,
        recommendation_letter_1: null,
        recommendation_letter_2: null,
        passport_photo: null
    });

    const [authDebug, setAuthDebug] = useState({
        isAuthenticated: false,
        token: null,
        tokenValid: false,
        lastCheck: null
    });

    useEffect(() => {
        loadPrograms();
        checkAuthStatus(); // Check auth status on mount
        console.log('🔍 ApplicationForm mounted, current step:', currentStep);
    }, []);
    
    useEffect(() => {
        console.log('🔍 Step changed to:', currentStep);
    }, [currentStep]);

    const loadPrograms = async () => {
        try {
            const data = await getPrograms();
            setPrograms(data);
        } catch (error) {
            console.error('Error loading programs:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        
        if (type === 'file') {
            setFormData(prev => ({
                ...prev,
                [name]: files[0] || null
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        console.log('🔍 Validating form...');
        
        // Required field validation
        const requiredFields = [
            'program', 'first_name', 'last_name', 'date_of_birth', 'gender', 
            'nationality', 'marital_status', 'email', 'phone_number', 
            'address_line_1', 'city', 'country', 'emergency_contact_name',
            'emergency_contact_phone', 'emergency_contact_relationship', 
            'previous_education'
        ];
        
        requiredFields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = 'This field is required';
                console.log(`❌ Missing required field: ${field}`);
            } else {
                console.log(`✅ Field ${field}: ${formData[field]}`);
            }
        });

        // File validation
        const requiredFiles = ['transcript', 'personal_statement', 'recommendation_letter_1', 'passport_photo'];
        requiredFiles.forEach(file => {
            if (!formData[file]) {
                newErrors[file] = 'This file is required';
                console.log(`❌ Missing required file: ${file}`);
            } else {
                console.log(`✅ File ${file}: ${formData[file]?.name || 'uploaded'}`);
            }
        });

        // Email validation
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Age validation
        if (formData.date_of_birth) {
            const today = new Date();
            const birthDate = new Date(formData.date_of_birth);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 18) {
                newErrors.date_of_birth = 'Applicant must be at least 18 years old';
            }
        }

        setErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        console.log(`🔍 Validation result: ${isValid ? 'PASSED' : 'FAILED'}`);
        console.log('🔍 Errors:', newErrors);
        return isValid;
    };

    // Check authentication status
    const checkAuthStatus = () => {
        const token = localStorage.getItem('access_token') || localStorage.getItem('userToken');
        const isAuthenticated = !!token;
        
        setAuthDebug({
            isAuthenticated,
            token: token ? token.substring(0, 20) + '...' : null,
            tokenValid: isAuthenticated,
            lastCheck: new Date().toISOString()
        });
        
        console.log('🔍 Auth check result:', { isAuthenticated, token: token ? 'Present' : 'None' });
    };

    // Enhanced form submission with auth debugging
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        alert('🔍 Form submit triggered! Check console for details.');
        console.log('🔍 Form submit triggered!');
        console.log('🔍 Current step:', currentStep);
        console.log('🔍 Form data:', formData);
        console.log('🔍 Form element:', e.target);
        console.log('🔍 Event type:', e.type);
        
        // Check auth status before submission
        checkAuthStatus();
        
        // Wait a moment for state to update
        setTimeout(() => {
            if (!authDebug.isAuthenticated) {
                alert('❌ Authentication Error: You must be logged in to submit an application. Please log in and try again.');
                return;
            }
            
            submitApplication();
        }, 100);
    };

    // Separate function for actual submission
    const submitApplication = async () => {
        console.log('🔍 submitApplication function called!');
        alert('🔍 submitApplication function called! Check console for details.');
        
        // Temporarily bypass validation for testing
        console.log('🔍 Bypassing validation for testing...');
        /*
        if (!validateForm()) {
            console.log('❌ Form validation failed');
            return;
        }
        console.log('✅ Form validation passed');
        */

        setLoading(true);
        try {
            const formDataToSend = new FormData();
            
            // Append all fields to FormData
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== '') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            console.log('🔍 Sending form data:', formDataToSend);

            let applicationData;
            if (editMode && applicationId) {
                // Update existing application (draft only)
                applicationData = await updateMyApplication(applicationId, formDataToSend);
                alert('Application updated successfully!');
            } else {
                // Create new application
                applicationData = await createMyApplication(formDataToSend);
                alert('Application created successfully!');
            }
            
            // Submit the application for admin review
            const applicationIdToSubmit = editMode ? applicationId : applicationData.id;
            await submitMyApplication(applicationIdToSubmit);
            // Show success message
            const successMsg = `Application submitted successfully!\n\nApplication ID: ${applicationData.application_id}\nProgram: ${applicationData.program_name}\nStatus: Submitted for Admin Review\n\nYou will be redirected to the success page.`;
            alert(successMsg);
            
            // Redirect to success page with application data
            console.log('🔍 Attempting to navigate to success page...');
            console.log('🔍 Navigation state:', {
                applicationData: {
                    application_id: applicationData.application_id,
                    program_name: applicationData.program_name,
                    submitted_at: new Date().toLocaleDateString(),
                    status: 'submitted'
                }
            });
            
            // Small delay to ensure state is properly set
            setTimeout(() => {
                try {
                    console.log('🔍 Navigating to success page...');
                    navigate('/applications/submission-success', { 
                        state: { 
                            applicationData: {
                                application_id: applicationData.application_id,
                                program_name: applicationData.program_name,
                                submitted_at: new Date().toLocaleDateString(),
                                status: 'submitted'
                            }
                        }
                    });
                    console.log('✅ Navigation successful');
                } catch (navError) {
                    console.error('❌ Navigation failed:', navError);
                    // Fallback: try to navigate without state
                    navigate('/applications/submission-success');
                }
            }, 100);
            
        } catch (error) {
            console.error('Error submitting application:', error);
            setLoading(false);
            
            // Show detailed error message
            let errorMessage = 'Failed to submit application. Please try again.';
            let errorDetails = '';
            
            if (error?.response?.data) {
                if (typeof error.response.data === 'object') {
                    errorDetails = Object.entries(error.response.data)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join('\n');
                } else {
                    errorDetails = error.response.data;
                }
                errorMessage = `Submission Failed!\n\n${errorDetails}`;
            } else if (error?.message) {
                errorMessage = `Error: ${error.message}`;
            }
            
            alert(errorMessage);
            
            // If it's a validation error, don't redirect
            if (error?.response?.status === 400) {
                return;
            }
        } finally {
            setLoading(false);
        }
    };

                const steps = [
                { id: 1, title: 'Program & Personal Info', icon: '👤' },
                { id: 2, title: 'Contact & Emergency', icon: '📧' },
                { id: 3, title: 'Academic Background', icon: '🎓' },
                { id: 4, title: 'Documents & Submit', icon: '📄' }
            ];

    const nextStep = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const renderStepContent = () => {
        switch(currentStep) {
            case 1:
                return (
                    <div className="step-content">
                        <h4 className="mb-4">Program Selection & Personal Information</h4>
                        
                        {/* Program Selection */}
                        <div className="form-section mb-4">
                            <h6 className="section-title">Program Selection</h6>
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="program" className="form-label">Select Program *</label>
                                    <select
                                        id="program"
                                        name="program"
                                        className={`form-select ${errors.program ? 'is-invalid' : ''}`}
                                        value={formData.program}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Choose a program...</option>
                                        {programs.map(program => (
                                            <option key={program.id} value={program.id}>
                                                {program.name} ({program.level})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.program && <div className="invalid-feedback">{errors.program}</div>}
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="form-section">
                            <h6 className="section-title">Personal Information</h6>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="first_name" className="form-label">First Name *</label>
                                    <input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="middle_name" className="form-label">Middle Name</label>
                                    <input
                                        type="text"
                                        id="middle_name"
                                        name="middle_name"
                                        className="form-control"
                                        value={formData.middle_name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="last_name" className="form-label">Last Name *</label>
                                    <input
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="date_of_birth" className="form-label">Date of Birth *</label>
                                    <input
                                        type="date"
                                        id="date_of_birth"
                                        name="date_of_birth"
                                        className={`form-control ${errors.date_of_birth ? 'is-invalid' : ''}`}
                                        value={formData.date_of_birth}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.date_of_birth && <div className="invalid-feedback">{errors.date_of_birth}</div>}
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="gender" className="form-label">Gender *</label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select...</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="marital_status" className="form-label">Marital Status *</label>
                                    <select
                                        id="marital_status"
                                        name="marital_status"
                                        className={`form-select ${errors.marital_status ? 'is-invalid' : ''}`}
                                        value={formData.marital_status}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select...</option>
                                        <option value="single">Single</option>
                                        <option value="married">Married</option>
                                        <option value="divorced">Divorced</option>
                                        <option value="widowed">Widowed</option>
                                    </select>
                                    {errors.marital_status && <div className="invalid-feedback">{errors.marital_status}</div>}
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="nationality" className="form-label">Nationality *</label>
                                    <input
                                        type="text"
                                        id="nationality"
                                        name="nationality"
                                        className={`form-control ${errors.nationality ? 'is-invalid' : ''}`}
                                        value={formData.nationality}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.nationality && <div className="invalid-feedback">{errors.nationality}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="step-content">
                        <h4 className="mb-4">Contact & Emergency Information</h4>
                        
                        {/* Contact Information */}
                        <div className="form-section mb-4">
                            <h6 className="section-title">Contact Information</h6>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="email" className="form-label">Email Address *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="phone_number" className="form-label">Phone Number *</label>
                                    <input
                                        type="tel"
                                        id="phone_number"
                                        name="phone_number"
                                        className={`form-control ${errors.phone_number ? 'is-invalid' : ''}`}
                                        value={formData.phone_number}
                                        onChange={handleInputChange}
                                        placeholder="+1234567890"
                                        required
                                    />
                                    {errors.phone_number && <div className="invalid-feedback">{errors.phone_number}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="address_line_1" className="form-label">Address Line 1 *</label>
                                    <input
                                        type="text"
                                        id="address_line_1"
                                        name="address_line_1"
                                        className={`form-control ${errors.address_line_1 ? 'is-invalid' : ''}`}
                                        value={formData.address_line_1}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.address_line_1 && <div className="invalid-feedback">{errors.address_line_1}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="address_line_2" className="form-label">Address Line 2</label>
                                    <input
                                        type="text"
                                        id="address_line_2"
                                        name="address_line_2"
                                        className="form-control"
                                        value={formData.address_line_2}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label htmlFor="city" className="form-label">City *</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label htmlFor="state_province" className="form-label">State/Province</label>
                                    <input
                                        type="text"
                                        id="state_province"
                                        name="state_province"
                                        className="form-control"
                                        value={formData.state_province}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label htmlFor="postal_code" className="form-label">Postal Code</label>
                                    <input
                                        type="text"
                                        id="postal_code"
                                        name="postal_code"
                                        className="form-control"
                                        value={formData.postal_code}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label htmlFor="country" className="form-label">Country *</label>
                                    <input
                                        type="text"
                                        id="country"
                                        name="country"
                                        className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="form-section">
                            <h6 className="section-title">Emergency Contact</h6>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="emergency_contact_name" className="form-label">Emergency Contact Name *</label>
                                    <input
                                        type="text"
                                        id="emergency_contact_name"
                                        name="emergency_contact_name"
                                        className={`form-control ${errors.emergency_contact_name ? 'is-invalid' : ''}`}
                                        value={formData.emergency_contact_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.emergency_contact_name && <div className="invalid-feedback">{errors.emergency_contact_name}</div>}
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="emergency_contact_phone" className="form-label">Emergency Contact Phone *</label>
                                    <input
                                        type="tel"
                                        id="emergency_contact_phone"
                                        name="emergency_contact_phone"
                                        className={`form-control ${errors.emergency_contact_phone ? 'is-invalid' : ''}`}
                                        value={formData.emergency_contact_phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors.emergency_contact_phone && <div className="invalid-feedback">{errors.emergency_contact_phone}</div>}
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="emergency_contact_relationship" className="form-label">Relationship *</label>
                                    <input
                                        type="text"
                                        id="emergency_contact_relationship"
                                        name="emergency_contact_relationship"
                                        className={`form-control ${errors.emergency_contact_relationship ? 'is-invalid' : ''}`}
                                        value={formData.emergency_contact_relationship}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Parent, Spouse, Sibling"
                                        required
                                    />
                                    {errors.emergency_contact_relationship && <div className="invalid-feedback">{errors.emergency_contact_relationship}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="step-content">
                        <h4 className="mb-4">Academic & Religious Background</h4>
                        
                        <div className="form-section">
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="previous_education" className="form-label">Previous Education *</label>
                                    <textarea
                                        id="previous_education"
                                        name="previous_education"
                                        className={`form-control ${errors.previous_education ? 'is-invalid' : ''}`}
                                        value={formData.previous_education}
                                        onChange={handleInputChange}
                                        rows="4"
                                        placeholder="Describe your educational background, including degrees, institutions, and graduation dates..."
                                        required
                                    />
                                    {errors.previous_education && <div className="invalid-feedback">{errors.previous_education}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="current_church_affiliation" className="form-label">Current Church Affiliation</label>
                                    <input
                                        type="text"
                                        id="current_church_affiliation"
                                        name="current_church_affiliation"
                                        className="form-control"
                                        value={formData.current_church_affiliation}
                                        onChange={handleInputChange}
                                        placeholder="Name of your current church"
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="pastoral_experience" className="form-label">Pastoral Experience</label>
                                    <textarea
                                        id="pastoral_experience"
                                        name="pastoral_experience"
                                        className="form-control"
                                        value={formData.pastoral_experience}
                                        onChange={handleInputChange}
                                        rows="3"
                                        placeholder="Describe any pastoral or ministry experience you have..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="step-content">
                        <h4 className="mb-4">Required Documents</h4>
                        
                        <div className="form-section">
                            <div className="alert alert-info mb-4">
                                <i className="material-symbols-outlined me-2">info</i>
                                Please upload all required documents. Accepted formats: PDF, DOC, DOCX (for documents) and JPG, JPEG, PNG (for photos).
                            </div>
                            
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="transcript" className="form-label">Academic Transcripts *</label>
                                    <input
                                        type="file"
                                        id="transcript"
                                        name="transcript"
                                        className={`form-control ${errors.transcript ? 'is-invalid' : ''}`}
                                        onChange={handleInputChange}
                                        accept=".pdf,.doc,.docx"
                                        required
                                    />
                                    <div className="form-text">Upload official academic transcripts</div>
                                    {errors.transcript && <div className="invalid-feedback">{errors.transcript}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="personal_statement" className="form-label">Personal Statement *</label>
                                    <input
                                        type="file"
                                        id="personal_statement"
                                        name="personal_statement"
                                        className={`form-control ${errors.personal_statement ? 'is-invalid' : ''}`}
                                        onChange={handleInputChange}
                                        accept=".pdf,.doc,.docx"
                                        required
                                    />
                                    <div className="form-text">Upload your personal statement/essay</div>
                                    {errors.personal_statement && <div className="invalid-feedback">{errors.personal_statement}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="recommendation_letter_1" className="form-label">First Recommendation Letter *</label>
                                    <input
                                        type="file"
                                        id="recommendation_letter_1"
                                        name="recommendation_letter_1"
                                        className={`form-control ${errors.recommendation_letter_1 ? 'is-invalid' : ''}`}
                                        onChange={handleInputChange}
                                        accept=".pdf,.doc,.docx"
                                        required
                                    />
                                    <div className="form-text">First recommendation letter</div>
                                    {errors.recommendation_letter_1 && <div className="invalid-feedback">{errors.recommendation_letter_1}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="recommendation_letter_2" className="form-label">Second Recommendation Letter</label>
                                    <input
                                        type="file"
                                        id="recommendation_letter_2"
                                        name="recommendation_letter_2"
                                        className="form-control"
                                        onChange={handleInputChange}
                                        accept=".pdf,.doc,.docx"
                                    />
                                    <div className="form-text">Second recommendation letter (optional)</div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="passport_photo" className="form-label">Passport-size Photograph *</label>
                                    <input
                                        type="file"
                                        id="passport_photo"
                                        name="passport_photo"
                                        className={`form-control ${errors.passport_photo ? 'is-invalid' : ''}`}
                                        onChange={handleInputChange}
                                        accept=".jpg,.jpeg,.png"
                                        required
                                    />
                                    <div className="form-text">Upload passport-size photograph</div>
                                    {errors.passport_photo && <div className="invalid-feedback">{errors.passport_photo}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="application-form-container">
            {/* Header */}
            <header className="application-header">
                <div className="container">
                    <div className="d-flex align-items-center justify-content-between py-3">
                        <Link to="/" className="d-flex align-items-center text-decoration-none">
                            <img src={Logo} alt="PTS Kumba" style={{height:'50px'}} className="me-3"/>
                            <div>
                                <h5 className="mb-0 text-dark fw-bold">PTS Kumba</h5>
                                <small className="text-muted">Presbyterian Theological Seminary</small>
                            </div>
                        </Link>
                        <div className="d-flex gap-2">
                            <Link to="/" className="btn btn-outline-secondary btn-icon" title="Home">
                                🏠
                            </Link>
                            <Link to="/programs" className="btn btn-outline-primary btn-icon" title="View Programs">
                                🎓
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="application-main">
                <div className="container py-4">
                    {/* Authentication Debug Panel */}
                    <div className="row mb-4">
                        <div className="col-xl-12">
                            <div className="card border-info">
                                <div className="card-header bg-info text-white">
                                    <h5 className="heading mb-0">🔐 Authentication Status</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <p><strong>Status:</strong> 
                                                <span className={`badge ${authDebug.isAuthenticated ? 'bg-success' : 'bg-danger'} ms-2`}>
                                                    {authDebug.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="col-md-3">
                                            <p><strong>Token:</strong> {authDebug.token || 'None'}</p>
                                        </div>
                                        <div className="col-md-3">
                                            <p><strong>Valid:</strong> 
                                                <span className={`badge ${authDebug.tokenValid ? 'bg-success' : 'bg-danger'} ms-2`}>
                                                    {authDebug.tokenValid ? 'Yes' : 'No'}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="col-md-3">
                                            <button className="btn btn-primary btn-sm" onClick={checkAuthStatus}>
                                                <i className="fas fa-sync me-2"></i>Check Auth
                                            </button>
                                        </div>
                                    </div>
                                    {!authDebug.isAuthenticated && (
                                        <div className="alert alert-warning mt-3">
                                            <strong>⚠️ Authentication Required:</strong> You must be logged in to submit an application. 
                                            <a href="/login" className="btn btn-warning btn-sm ms-3">Go to Login</a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* API Testing & Debug Panel */}
                    <div className="row mb-4">
                        <div className="col-xl-12">
                            <div className="card border-warning">
                                <div className="card-header bg-warning text-white">
                                    <h5 className="heading mb-0">🧪 API Testing & Debug</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <h6>Test Applications API</h6>
                                            <div className="d-grid gap-2">
                                                <button 
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={async () => {
                                                        try {
                                                            console.log('🧪 Testing getPrograms...');
                                                            const result = await getPrograms();
                                                            console.log('✅ getPrograms result:', result);
                                                            alert(`✅ getPrograms successful! Found ${result.length} programs`);
                                                        } catch (error) {
                                                            console.error('❌ getPrograms failed:', error);
                                                            alert(`❌ getPrograms failed: ${error.message}`);
                                                        }
                                                    }}
                                                >
                                                    Test Get Programs
                                                </button>
                                                <button 
                                                    className="btn btn-outline-success btn-sm"
                                                    onClick={async () => {
                                                        try {
                                                            console.log('🧪 Testing createMyApplication...');
                                                            const testData = new FormData();
                                                            testData.append('program', '1');
                                                            testData.append('first_name', 'Test');
                                                            testData.append('last_name', 'User');
                                                            const result = await createMyApplication(testData);
                                                            console.log('✅ createMyApplication result:', result);
                                                            alert('✅ createMyApplication successful!');
                                                        } catch (error) {
                                                            console.error('❌ createMyApplication failed:', error);
                                                            alert(`❌ createMyApplication failed: ${error.message}`);
                                                        }
                                                    }}
                                                >
                                                    Test Create Application
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <h6>Test Users API</h6>
                                            <div className="d-grid gap-2">
                                                <button 
                                                    className="btn btn-outline-info btn-sm"
                                                    onClick={async () => {
                                                        try {
                                                            console.log('🧪 Testing localStorage...');
                                                            const token = localStorage.getItem('access_token') || localStorage.getItem('userToken');
                                                            const userData = localStorage.getItem('userData');
                                                            console.log('✅ localStorage check:', { token: token ? 'Present' : 'None', userData });
                                                            alert(`✅ localStorage check: Token ${token ? 'Present' : 'None'}, UserData ${userData ? 'Present' : 'None'}`);
                                                        } catch (error) {
                                                            console.error('❌ localStorage check failed:', error);
                                                            alert(`❌ localStorage check failed: ${error.message}`);
                                                        }
                                                    }}
                                                >
                                                    Test LocalStorage
                                                </button>
                                                <button 
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => {
                                                        console.log('🧪 Testing form validation...');
                                                        const isValid = validateForm();
                                                        console.log('✅ Form validation result:', isValid);
                                                        alert(`✅ Form validation: ${isValid ? 'PASSED' : 'FAILED'}`);
                                                    }}
                                                >
                                                    Test Form Validation
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <h6>Debug Actions</h6>
                                            <div className="d-grid gap-2">
                                                <button 
                                                    className="btn btn-outline-dark btn-sm"
                                                    onClick={() => {
                                                        console.log('🧪 Logging current state...');
                                                        console.log('Current step:', currentStep);
                                                        console.log('Form data:', formData);
                                                        console.log('Auth debug:', authDebug);
                                                        console.log('Loading:', loading);
                                                        alert('✅ State logged to console!');
                                                    }}
                                                >
                                                    Log Current State
                                                </button>
                                                <button 
                                                    className="btn btn-outline-warning btn-sm"
                                                    onClick={() => {
                                                        checkAuthStatus();
                                                        alert('✅ Auth status refreshed!');
                                                    }}
                                                >
                                                    Refresh Auth Status
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <h6>Quick Actions</h6>
                                            <div className="d-grid gap-2">
                                                <button 
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => {
                                                        if (confirm('Clear all form data?')) {
                                                            setFormData({
                                                                program: '',
                                                                first_name: '',
                                                                middle_name: '',
                                                                last_name: '',
                                                                date_of_birth: '',
                                                                gender: '',
                                                                nationality: '',
                                                                marital_status: '',
                                                                email: '',
                                                                phone_number: '',
                                                                address_line_1: '',
                                                                address_line_2: '',
                                                                city: '',
                                                                state_province: '',
                                                                postal_code: '',
                                                                country: '',
                                                                emergency_contact_name: '',
                                                                emergency_contact_phone: '',
                                                                emergency_contact_relationship: '',
                                                                previous_education: '',
                                                                current_church_affiliation: '',
                                                                pastoral_experience: '',
                                                                transcript: null,
                                                                personal_statement: null,
                                                                recommendation_letter_1: null,
                                                                recommendation_letter_2: null,
                                                                passport_photo: null
                                                            });
                                                            setCurrentStep(1);
                                                            alert('✅ Form data cleared!');
                                                        }
                                                    }}
                                                >
                                                    Clear Form Data
                                                </button>
                                                <button 
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => {
                                                        setCurrentStep(4);
                                                        alert('✅ Jumped to final step!');
                                                    }}
                                                >
                                                    Jump to Final Step
                                                </button>
                                                <button 
                                                    className="btn btn-outline-success btn-sm"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        console.log('🧪 Test submit button clicked!');
                                                        console.log('🧪 Simulating form submission...');
                                                        handleSubmit(e);
                                                    }}
                                                >
                                                    Test Submit
                                                </button>
                                                <button 
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => {
                                                        console.log('🧪 Direct submit test...');
                                                        const fakeEvent = { preventDefault: () => {}, target: document.createElement('form'), type: 'submit' };
                                                        handleSubmit(fakeEvent);
                                                    }}
                                                >
                                                    Direct Submit Test
                                                </button>
                                                <button 
                                                    className="btn btn-outline-warning btn-sm"
                                                    onClick={() => {
                                                        console.log('🧪 Bypass validation test...');
                                                        // Temporarily bypass validation
                                                        submitApplication();
                                                    }}
                                                >
                                                    Bypass Validation
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            {/* Progress Steps */}
                            <div className="steps-container mb-4">
                                <div className="steps-header text-center mb-4">
                                    <h2 className="fw-bold text-dark">Application for Admission</h2>
                                    <p className="text-muted">Complete all steps to submit your application</p>
                                </div>
                                
                                <div className="steps-progress">
                                    <div className="row">
                                        {steps.map((step, index) => (
                                            <div key={step.id} className="col-3">
                                                                                            <div className={`step-item ${currentStep >= step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}>
                                                <div className="step-circle">
                                                    <span className="step-icon">{step.icon}</span>
                                                </div>
                                                <div className="step-title">{step.title}</div>
                                                {index < steps.length - 1 && <div className="step-line"></div>}
                                            </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Form Card */}
                            <div className="application-card">
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    {renderStepContent()}
                                    
                                    {/* Navigation Buttons */}
                                    <div className="step-navigation">
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                {currentStep > 1 && (
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-outline-secondary"
                                                        onClick={prevStep}
                                                        title="Previous Step"
                                                    >
                                                        <i className="material-symbols-outlined">PREV</i>
                                                    </button>
                                                )}
                                            </div>
                                            <div>
                                                {currentStep < 4 ? (
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-primary"
                                                        onClick={nextStep}
                                                        title="Next Step"
                                                    >
                                                        <i className="material-symbols-outlined">NEXT</i>
                                                    </button>
                                                ) : (
                                                    <button 
                                                        type="submit" 
                                                        className="btn btn-success btn-lg"
                                                        disabled={loading}
                                                        onMouseEnter={() => console.log('🔍 Submit button hovered - ready to submit')}
                                                        onClick={() => console.log('🔍 Submit button clicked directly')}
                                                    >
                                                        {loading ? (
                                                                                                                    <>
                                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                                            Submitting for Review...
                                                        </>
                                                    ) : (
                                                        <>
                                                            ✉️
                                                            Submit Application
                                                        </>
                                                    )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Custom Styles */}
            <style>{`
                .application-form-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                }
                
                .application-header {
                    background: white;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                
                .application-main {
                    flex: 1;
                }
                
                .steps-container {
                    background: white;
                    border-radius: 15px;
                    padding: 2rem;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    margin-bottom: 2rem;
                }
                
                .steps-progress {
                    position: relative;
                }
                
                .step-item {
                    text-align: center;
                    position: relative;
                }
                
                .step-circle {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: #e9ecef;
                    color: #6c757d;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 0.5rem;
                    transition: all 0.3s ease;
                    font-size: 24px;
                }
                
                .step-icon {
                    font-size: 1.8rem;
                    line-height: 1;
                }
                
                .step-item.active .step-circle {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    transform: scale(1.1);
                }
                
                .step-item.completed .step-circle {
                    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                    color: white;
                }
                
                .step-title {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #6c757d;
                }
                
                .step-item.active .step-title {
                    color: #667eea;
                }
                
                .step-item.completed .step-title {
                    color: #4CAF50;
                }
                
                .step-line {
                    position: absolute;
                    top: 30px;
                    left: calc(50% + 30px);
                    width: calc(100% - 60px);
                    height: 2px;
                    background: #e9ecef;
                    z-index: -1;
                }
                
                .step-item.completed .step-line {
                    background: #4CAF50;
                }
                
                .application-card {
                    background: white;
                    border-radius: 15px;
                    padding: 2rem;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
                
                .step-content h4 {
                    color: #2c3e50;
                    border-bottom: 2px solid #667eea;
                    padding-bottom: 0.5rem;
                    margin-bottom: 1.5rem;
                }
                
                .form-section {
                    margin-bottom: 2rem;
                }
                
                .section-title {
                    color: #495057;
                    font-weight: 600;
                    margin-bottom: 1rem;
                    padding-left: 0.5rem;
                    border-left: 4px solid #667eea;
                }
                
                .form-control, .form-select {
                    border-radius: 8px;
                    border: 1px solid #e9ecef;
                    padding: 0.75rem;
                    transition: all 0.3s ease;
                }
                
                .form-control:focus, .form-select:focus {
                    border-color: #667eea;
                    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
                }
                
                .form-label {
                    font-weight: 600;
                    color: #495057;
                    margin-bottom: 0.5rem;
                }
                
                .step-navigation {
                    margin-top: 2rem;
                    padding-top: 2rem;
                    border-top: 1px solid #e9ecef;
                }
                
                .btn {
                    border-radius: 25px;
                    padding: 0.75rem 1.5rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                
                .btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                }
                
                .btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                }
                
                .btn-success {
                    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                    border: none;
                }
                
                .btn-icon {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    transition: all 0.3s ease;
                }
                
                .btn-icon:hover {
                    transform: translateY(-2px) scale(1.1);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                }
                
                .alert-info {
                    border-radius: 10px;
                    border: none;
                    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
                }
                
                @media (max-width: 768px) {
                    .steps-container, .application-card {
                        margin: 1rem;
                        padding: 1rem;
                    }
                    
                    .step-circle {
                        width: 50px;
                        height: 50px;
                        font-size: 20px;
                    }
                    
                    .step-title {
                        font-size: 0.8rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default ApplicationForm;