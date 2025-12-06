import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { IMAGES, SVGICON } from '../Dashboard/Content';
import { Dropdown } from 'react-bootstrap';
import PaymentHistoryTable from './PaymentHistoryTable';
import { getStudentById, deleteStudent } from '../../../services/SISService';
import { useAuthStore } from '../../../store/store';

import profile from './../../../assets/images/profile.svg';
import location from './../../../assets/images/svg/location.svg';
import phone from './../../../assets/images/svg/phone.svg';
import email from './../../../assets/images/svg/email.svg';

const scheduleBlog = [
    { title: 'Basic Algorithm', subtitle: 'Algorithm', image: IMAGES.avat1, color: 'schedule-card' },
    { title: 'Basic Art', subtitle: 'Art', image: IMAGES.avat2, color: 'schedule-card-1' },
    { title: 'React & Scss', subtitle: 'Programming', image: IMAGES.avat3, color: 'schedule-card-2' },
    { title: 'Simple Past Tense', subtitle: 'English', image: IMAGES.avat4, color: 'schedule-card-3' }
];

const basicDetail = [
    { title: 'Parents', subtitle: 'Justin Hope', image: profile },
    { title: 'Address', subtitle: 'Jakarta, Indonesia', image: location },
    { title: 'Phone', subtitle: '+12 345 6789 0', image: phone },
    { title: 'Email', subtitle: 'Historia@mail.com', image: email },
];


const StudentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, user } = useAuthStore();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load student data
    useEffect(() => {
        const loadStudent = async () => {
            try {
                setLoading(true);
                const studentData = await getStudentById(id);
                setStudent(studentData);
            } catch (err) {
                console.error('Error loading student:', err);
                setError('Failed to load student data: ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };

        if (id && token && user) {
            loadStudent();
        }
    }, [id, token, user]);

    // Handle delete student
    const handleDeleteStudent = async () => {
        if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
            try {
                await deleteStudent(id);
                alert('Student deleted successfully!');
                navigate('/student');
            } catch (err) {
                console.error('Error deleting student:', err);
                alert('Failed to delete student: ' + (err.response?.data?.message || err.message));
            }
        }
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

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                {error}
                <Link to="/student" className="btn btn-secondary ms-3">Back to Students</Link>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="alert alert-warning" role="alert">
                Student not found.
                <Link to="/student" className="btn btn-secondary ms-3">Back to Students</Link>
            </div>
        );
    }

    // Generate avatar initials
    const getInitials = (firstName, lastName) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    // Prepare basic details
    const basicDetail = [
        { title: 'Admission Number', subtitle: student.admission_number || 'N/A', image: profile },
        { title: 'Parent Contact', subtitle: student.parent_contact || 'N/A', image: phone },
        { title: 'Class Level', subtitle: student.class_level_display || 'N/A', image: location },
        { title: 'Gender', subtitle: student.gender || 'N/A', image: email },
    ];

    return (
        <div className="row">
            <div className="col-12 mb-3">
                <Link to="/student" className="btn btn-secondary">
                    <i className="fas fa-arrow-left me-2"></i>Back to Students
                </Link>
            </div>
            <div className="col-xl-9">
                <div className="card h-auto">
                    <div className="card-header p-0">
                        <div className="user-bg w-100">
                            <div className="user-svg">
                                <svg width="264" height="109" viewBox="0 0 264 109" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="0.0107422" y="0.6521" width="263.592" height="275.13" rx="20" fill="#FCC43E" />
                                </svg>
                            </div>
                            <div className="user-svg-1">
                                <svg width="264" height="59" viewBox="0 0 264 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect y="0.564056" width="263.592" height="275.13" rx="20" fill="#FB7D5B" />
                                </svg>

                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="d-flex justify-content-between">
                            <div className="user">
                                <div className="user-media">
                                    <div className="avatar avatar-xxl bg-primary text-white d-flex align-items-center justify-content-center" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                        {getInitials(student.first_name, student.last_name)}
                                    </div>
                                </div>
                                <div>
                                    <h2 className="mb-0">{student.first_name} {student.middle_name} {student.last_name}</h2>
                                    <p className="text-primary font-w600">Student ID: {student.id}</p>
                                </div>
                            </div>
                            <Dropdown className="custom-dropdown">
                                <Dropdown.Toggle as="div" className="i-false btn sharp tp-btn ">
                                    {SVGICON.dots}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-menu-end" align="end">
                                    <Dropdown.Item as={Link} to={`/add-student/${student.id}`}>
                                        <i className="fas fa-edit me-2"></i>Edit Student
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={handleDeleteStudent} className="text-danger">
                                        <i className="fas fa-trash me-2"></i>Delete Student
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="row mt-2">
                            {basicDetail.map((item, ind) => (
                                <div className="col-xl-3 col-xxl-6 col-sm-6" key={ind}>
                                    <ul className="student-details">
                                        <li className="me-2">
                                            <Link to={"#"} className="icon-box bg-secondary">
                                                <img src={item.image} alt="" />
                                            </Link>
                                        </li>
                                        <li>
                                            <span>{item.title}:</span>
                                            <h5 className="mb-0">{item.subtitle}</h5>
                                        </li>
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Additional Student Information */}
                <div className="card h-auto mt-4">
                    <div className="card-header border-0 p-3">
                        <h4 className="heading mb-0">Student Information</h4>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Date of Birth:</label>
                                    <p className="mb-0">{student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : 'N/A'}</p>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Religion:</label>
                                    <p className="mb-0">{student.religion || 'N/A'}</p>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Class of Year:</label>
                                    <p className="mb-0">{student.class_of_year_display || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Address:</label>
                                    <p className="mb-0">
                                        {[student.street, student.city, student.region].filter(Boolean).join(', ') || 'N/A'}
                                    </p>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">PREMIS Number:</label>
                                    <p className="mb-0">{student.prems_number || 'N/A'}</p>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">STD VII Number:</label>
                                    <p className="mb-0">{student.std_vii_number || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="card h-auto">
                    <div className="card-header border-0 p-3">
                        <h4 className="heading mb-0">Payment History</h4>
                    </div>
                    <div className="card-body p-0">
                        <PaymentHistoryTable />
                    </div>
                </div>
            </div>
            <div className='col-xl-3'>
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card h-auto">
                            <div className="card-body">
                                <h3 className="heading">Schedule Details</h3>
                                <p className="mb-0">Thursday, 10th April , 2022</p>
                            </div>
                        </div>
                    </div>
                    {scheduleBlog.map((data, index) => (
                        <div className="col-xl-12 col-sm-6" key={index}>
                            <div className={`card h-auto ${data.color}`}>
                                <div className="card-body">
                                    <h4 className="mb-0">{data.title}</h4>
                                    <p>{data.subtitle}</p>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <ul>
                                                <li className="mb-2">
                                                    {SVGICON.calndar}
                                                    {" "}July 20, 2023
                                                </li>
                                                <li>
                                                    {SVGICON.watch}
                                                    {" "}09.00 - 10.00 AM
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <img src={data.image} className="avatar avatar-lg" alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="col-xl-12">
                        <Link to={"#"} className="btn btn-primary btn-block light btn-rounded mb-5">View More</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetails;