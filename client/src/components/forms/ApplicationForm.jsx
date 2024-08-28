import styles from '../../styles/ApplicationForm.module.css'; 
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';   
import { Container, Row, Col, Form, Alert } from 'react-bootstrap';
import LoadingIndicator from '../common/LoadingIndicator';  
import { fetchCourses, updateAdvisor, submitApplication, fetchUserDetailsForApplication } from '../../services/api'; // Assume these functions are defined in an API service file

//TODO: how to determin status? 
//TODO: vars needs that needs further consideration: name, GPA, status, advisor, [REC, LEC, QUIZ] classes
 
function ApplicationForm({ eid: propEid }) { 
    const userData = useContext(UserContext);
    const [studentData, setStudentData] = useState({}); 
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [alertStatus, setAlertStatus] = useState('info');
    const [showAlert, setShowAlert] = useState(false);
    const [selectedAdvisor, setSelectedAdvisor] = useState('');
    const [courseUpdates, setCourseUpdates] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [additionalInfo, setAdditionalInfo] = useState('');

    const eid = propEid || userData.eid; 
    console.log("Actualy EID: " + eid + " propEID: " + propEid + " userData.eid: " + userData.eid);
    const name = "";
    const hardcodedGPA = "3.5"; 

    useEffect(() => {
        if (!eid) return;  

        setLoading(true);
        fetchUserDetailsForApplication(eid)
            .then(profileData => {  
                setStudentData(profileData);
                setSelectedAdvisor(profileData.advisor);
                propEid = null;
                return fetchCourses(profileData.wid);
            })
            .then(coursesResponse  => { 
                if (!Array.isArray(coursesResponse.courses)) {
                    throw new Error('Courses data is not an array');
                }
                setCourses(coursesResponse.courses);
                initializeCourseUpdates(coursesResponse);
            })
            .catch(error => {
                console.error('Failed to fetch data:', error);
                updateUserMessage('Failed to load user details.', 'danger');
            })
            .finally(() => setLoading(false));
    }, [eid]); 

    function initializeCourseUpdates(coursesData) { 
        const updates = {};
        coursesData.courses.forEach(course => {
            updates[`${course.class_subject}-${course.class_catalog}`] = {
                status: course.status,
                grade: course.grade
            };
        });
        setCourseUpdates(updates);
    }

    const handleAdvisorUpdate = async (eid, newAdvisor) => {
        setLoading(true);
        try {
            await updateAdvisor(eid, newAdvisor);
            updateUserMessage('Advisor updated successfully.', 'success');
        } catch (error) {
            console.error('Error updating advisor:', error);
            updateUserMessage(`Error updating advisor: ${error.message}`, 'danger');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        try {
            await handleAdvisorUpdate(studentData.eid, selectedAdvisor);
            const result = await submitApplication(studentData, additionalInfo, courseUpdates);
            await fetchCourses(studentData.wid);
            setStatusMessage(result.message);
            setAlertStatus('success');
            setShowAlert(true);
        } catch (error) {
            console.error('Submission failed:', error);
            setStatusMessage('Failed to submit application. Please try again.');
            setAlertStatus('danger');
            setShowAlert(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleAdditionalInfoChange = (event) => {
        setAdditionalInfo(event.target.value);
    };

    const handleCourseChange = (courseKey, field, value) => {
        setCourseUpdates(prev => ({
            ...prev,
            [courseKey]: { ...prev[courseKey], [field]: value }
        }));
    }; 

    const updateUserMessage = (message, status) => {
        setStatusMessage(message);
        setAlertStatus(status);
        setShowAlert(true);
    };

    const handleSelectedAdvisorUpdate = (event) => {
        setSelectedAdvisor(event.target.value);
    };

    const statusOptions = [
        { value: "Complete", label: "Complete" },
        { value: "In-Progress", label: "In Progress" },
        { value: "transferred", label: "Transferred" },
        { value: "retaking", label: "Retaking" },
        { value: "waiver-requested", label: "Waiver Requested" },
    ];

    const gradeOptions = [
        { value: "n/a", label: "N/A" },
        { value: "A", label: "A" },
        { value: "B", label: "B" },
        { value: "C", label: "C" },
        { value: "D", label: "D" },
        { value: "F", label: "F" },
    ]; 

    if (!userData.isLoggedIn) {
        return <div>Please log in to view and submit the application.</div>;
    }

    if (loading) {
        return <LoadingIndicator />;
    }

    return (
        <Container className="mt-5"> 
            {showAlert && (
                <Alert variant={alertStatus} className={styles.alertStyle} onClose={() => setShowAlert(false)} dismissible>
                    {statusMessage }
                </Alert> 
            )} 
            <div className={styles.appHeader}>
                <h1 className={styles.h1Style}>Computer Science Apps</h1>
                <h2 className={styles.h2Style}>Professional Program Application</h2>
            </div>  
                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={2}> Name:</Form.Label>
                        <Col sm={10}>
                            <Form.Control type="text" value={studentData.first_name + " " + studentData.last_name} readOnly style={{ backgroundColor: '#d1d1d1' }} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={2}>WID:</Form.Label>
                        <Col sm={10}>
                            <Form.Control type="text" value={studentData.wid} readOnly style={{ backgroundColor: '#d1d1d1' }} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={2}>Advisor:</Form.Label>
                        <Col sm={10}>
                            <Form.Select value={selectedAdvisor} style={{ backgroundColor: '#d1d1d1' }} 
                                        onChange={handleSelectedAdvisorUpdate} >
                                <option value="Sheryl Cornell">Sheryl Cornell</option>
                                <option value="David Invergo">David Invergo</option>
                                {/* Additional advisor options can be added here */} 
                            </Form.Select>
                        </Col>
                    </Form.Group>
                    <Row className="mb-3">
                        <Col>
                            <strong>GPA: </strong>{hardcodedGPA}
                        </Col>
                    </Row>
                    <Row className='mb-3'>
                        <Col>
                            <div className={styles['custom-message-1']}>
                            <p>To be accepted to the Computer Science Professional Program, you must complete the following Pre-Professional Courses <em>with a grade of C or better</em> and <em>with a 2.3 cumulative</em> GPA <strong>within these courses</strong>.</p>
                            <p>Any courses you are currently taking can be marked as <em>In Progress</em>. Any courses that you do not plan on taking need to be marked <em>Waiver Requested</em> and the reasons you are asking for the waiver must be explained below.</p>
                            </div>
                        </Col>
                    </Row>
                    <div className={styles['custom-table-container']}> 
                        <table striped hover className={`${styles['custom-table']} ${styles['custom-table-striped']}`}>
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Course ID</th>
                                    <th>Status</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                            {Array.isArray(courses) && courses.map((course, index) => {
                                const courseKey = `${course.class_subject}-${course.class_catalog}`;
                                const courseUpdate = courseUpdates[courseKey] || {};
                                return (
                                    <tr key={index}>
                                        <td className="align-middle">{course.class_descr}</td>
                                        <td className="align-middle">{`${course.class_subject} ${course.class_catalog}`}</td>
                                        <td className="align-middle">
                                            <Form.Select
                                                name={`${courseKey}-status`}
                                                value={courseUpdate.status || ''}
                                                onChange={e => handleCourseChange(courseKey, 'status', e.target.value)}
                                            >
                                                {statusOptions.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </Form.Select>
                                        </td>
                                        <td className="align-middle">
                                            <Form.Select
                                                name={`${courseKey}-grade`}
                                                value={courseUpdate.grade || ''}
                                                onChange={e => handleCourseChange(courseKey, 'grade', e.target.value)}
                                            >
                                                {gradeOptions.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </Form.Select>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody> 
                        </table>
                    </div>
                    <Form.Group className="mb-3">
                        <div className={styles['custom-message-1']}>
                            <p> Please use this space to add any comments that should be made regarding these classes.</p>  
                            <p> If you requested a waiver for any of these classes, please explain in detail the reasons you are requesting a waiver for meeting all of the requirements for entrance into the Computer Science Professional Program. 
                                You may also be required to meet with the curriculum committee to evaluate the waiver request.</p> 
                        </div>  
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            placeholder="Add comments or additional information here" 
                            value={additionalInfo}
                            onChange={handleAdditionalInfoChange} />
                    </Form.Group>
                    <div className={styles['button-container']}>
                        <button className={styles['btn-submit']} type="submit" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>
                </Form>  
        </Container>
    );
}

export default ApplicationForm;
