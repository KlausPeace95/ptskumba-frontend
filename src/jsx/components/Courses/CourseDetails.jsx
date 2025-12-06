import React, { useState } from 'react';
import { Card, Row, Col, Badge, Button, Nav, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const CourseDetails = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('overview');

    const course = {
        id: id || 1,
        name: 'Introduction to Programming',
        code: 'CS101',
        department: 'Computer Science',
        credits: 3,
        students: 45,
        instructor: 'Dr. Alice Johnson',
        status: 'active',
        description: 'Fundamental concepts of computer programming using Python',
        prerequisites: 'None',
        semester: 'Fall 2024'
    };

    return (
        <div className="row">
            <div className="col-xl-12">
                <div className="card">
                    <Card.Header>
                        <h4 className="mb-0">{course.name}</h4>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={6}>
                                <h6>Course Code: <Badge bg="primary">{course.code}</Badge></h6>
                                <h6>Department: {course.department}</h6>
                                <h6>Credits: {course.credits}</h6>
                                <h6>Students: {course.students}</h6>
                            </Col>
                            <Col md={6}>
                                <h6>Instructor: {course.instructor}</h6>
                                <h6>Semester: {course.semester}</h6>
                                <h6>Prerequisites: {course.prerequisites}</h6>
                                <p>{course.description}</p>
                            </Col>
                        </Row>
                    </Card.Body>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails; 