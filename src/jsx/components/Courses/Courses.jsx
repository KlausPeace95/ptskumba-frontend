import React, { useState } from 'react';
import { Card, Row, Col, Badge, Button, Form, InputGroup, Table, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Courses = () => {
    const [activeTab, setActiveTab] = useState('all');

    const courses = [
        {
            id: 1,
            name: 'Introduction to Programming',
            code: 'CS101',
            department: 'Computer Science',
            credits: 3,
            students: 45,
            instructor: 'Dr. Alice Johnson',
            status: 'active'
        },
        {
            id: 2,
            name: 'Data Structures',
            code: 'CS201',
            department: 'Computer Science',
            credits: 4,
            students: 38,
            instructor: 'Dr. Bob Wilson',
            status: 'active'
        },
        {
            id: 3,
            name: 'Calculus I',
            code: 'MATH101',
            department: 'Mathematics',
            credits: 4,
            students: 52,
            instructor: 'Dr. Sarah Johnson',
            status: 'active'
        },
        {
            id: 4,
            name: 'Physics Fundamentals',
            code: 'PHY101',
            department: 'Physics',
            credits: 4,
            students: 40,
            instructor: 'Dr. Michael Brown',
            status: 'active'
        }
    ];

    const renderCourseCard = (course) => (
        <Col xl={3} lg={4} md={6} key={course.id}>
            <Card className="course-card">
                <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                        <div className="course-icon bg-success rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                            <i className="material-symbols-outlined text-white">school</i>
                        </div>
                        <div>
                            <h6 className="mb-1">{course.name}</h6>
                            <Badge bg="secondary" className="fs-12">{course.code}</Badge>
                        </div>
                    </div>
                    <p className="text-muted fs-14 mb-3">{course.department}</p>
                    <div className="row text-center mb-3">
                        <div className="col-6">
                            <h6 className="mb-1 text-primary">{course.credits}</h6>
                            <small className="text-muted">Credits</small>
                        </div>
                        <div className="col-6">
                            <h6 className="mb-1 text-success">{course.students}</h6>
                            <small className="text-muted">Students</small>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">Instructor: {course.instructor}</small>
                        <Link to={`/course-detail/${course.id}`} className="btn btn-sm btn-outline-primary">
                            View Details
                        </Link>
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );

    return (
        <div className="row">
            <div className="col-xl-12">
                <div className="card">
                    <div className="card-header">
                        <h4 className="mb-0">Course Management</h4>
                    </div>
                    <div className="card-body">
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <InputGroup>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Search courses..." 
                                        className="form-control"
                                    />
                                    <Button variant="outline-secondary">
                                        <i className="material-symbols-outlined">search</i>
                                    </Button>
                                </InputGroup>
                            </div>
                            <div className="col-md-6 text-end">
                                <Button variant="primary">
                                    <i className="material-symbols-outlined me-2">add</i>
                                    Add Course
                                </Button>
                            </div>
                        </div>

                        <Nav variant="tabs" className="mb-4" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                            <Nav.Item>
                                <Nav.Link eventKey="all" className="text-dark">All Courses</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="active" className="text-dark">Active</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="inactive" className="text-dark">Inactive</Nav.Link>
                            </Nav.Item>
                        </Nav>

                        <Row>
                            {courses.map(renderCourseCard)}
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Courses; 