import React, { useState } from 'react';
import { Nav, Card, Row, Col, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Department = () => {
    const [activeTab, setActiveTab] = useState('all');

    const departments = [
        {
            id: 1,
            name: 'Computer Science',
            code: 'CS',
            head: 'Dr. John Smith',
            students: 150,
            teachers: 12,
            status: 'active',
            description: 'Computer Science and Information Technology Department'
        },
        {
            id: 2,
            name: 'Mathematics',
            code: 'MATH',
            head: 'Dr. Sarah Johnson',
            students: 120,
            teachers: 8,
            status: 'active',
            description: 'Mathematics and Statistics Department'
        },
        {
            id: 3,
            name: 'Physics',
            code: 'PHY',
            head: 'Dr. Michael Brown',
            students: 95,
            teachers: 10,
            status: 'active',
            description: 'Physics and Applied Sciences Department'
        },
        {
            id: 4,
            name: 'English Literature',
            code: 'ENG',
            head: 'Dr. Emily Davis',
            students: 180,
            teachers: 15,
            status: 'active',
            description: 'English Language and Literature Department'
        }
    ];

    const renderDepartmentCard = (dept) => (
        <Col xl={3} lg={4} md={6} key={dept.id}>
            <Card className="department-card">
                <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                        <div className="department-icon bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                            <i className="material-symbols-outlined text-white">business</i>
                        </div>
                        <div>
                            <h6 className="mb-1">{dept.name}</h6>
                            <Badge bg="secondary" className="fs-12">{dept.code}</Badge>
                        </div>
                    </div>
                    <p className="text-muted fs-14 mb-3">{dept.description}</p>
                    <div className="row text-center mb-3">
                        <div className="col-6">
                            <h6 className="mb-1 text-primary">{dept.students}</h6>
                            <small className="text-muted">Students</small>
                        </div>
                        <div className="col-6">
                            <h6 className="mb-1 text-success">{dept.teachers}</h6>
                            <small className="text-muted">Teachers</small>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">Head: {dept.head}</small>
                        <Link to={`/department-detail/${dept.id}`} className="btn btn-sm btn-outline-primary">
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
                        <h4 className="mb-0">Department Management</h4>
                    </div>
                    <div className="card-body">
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <InputGroup>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Search departments..." 
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
                                    Add Department
                                </Button>
                            </div>
                        </div>

                        <Nav variant="tabs" className="mb-4" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                            <Nav.Item>
                                <Nav.Link eventKey="all" className="text-dark">All Departments</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="active" className="text-dark">Active</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="inactive" className="text-dark">Inactive</Nav.Link>
                            </Nav.Item>
                        </Nav>

                        <Row>
                            {departments.map(renderDepartmentCard)}
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Department; 