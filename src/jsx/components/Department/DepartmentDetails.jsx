import React, { useState } from 'react';
import { Card, Row, Col, Badge, Button, Nav, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const DepartmentDetails = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('overview');

    const department = {
        id: id || 1,
        name: 'Computer Science',
        code: 'CS',
        head: 'Dr. John Smith',
        students: 150,
        teachers: 12,
        status: 'active',
        description: 'Computer Science and Information Technology Department'
    };

    return (
        <div className="row">
            <div className="col-xl-12">
                <div className="card">
                    <Card.Header>
                        <h4 className="mb-0">{department.name} Department</h4>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={6}>
                                <h6>Department Code: <Badge bg="primary">{department.code}</Badge></h6>
                                <h6>Head: {department.head}</h6>
                                <h6>Students: {department.students}</h6>
                                <h6>Teachers: {department.teachers}</h6>
                            </Col>
                            <Col md={6}>
                                <p>{department.description}</p>
                            </Col>
                        </Row>
                    </Card.Body>
                </div>
            </div>
        </div>
    );
};

export default DepartmentDetails; 