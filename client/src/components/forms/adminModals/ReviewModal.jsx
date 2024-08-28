import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import he from 'he';
import styles from '../../../styles/AdminForm.module.css';

function ReviewModal({ show, onHide, application, courses, fetchCourses }) {
    const [editableNotes, setEditableNotes] = useState(application ? application.notes : '');
    const [darsUpdatedBy, setDarsUpdatedBy] = useState(application ? application.dars_updated_by : '');
    const [selectedStatus, setSelectedStatus] = useState(application ? application.status : '');
    const [notesBorder, setNotesBorder] = useState(false);
    
    const handleSaveChanges = async () => {
        const payload = {
            notes: editableNotes.trim(),
            dars_updated_by: darsUpdatedBy.trim(),
            status: selectedStatus
        };
    
        try {
            const response = await fetch(`http://localhost:3002/api/updateApplication/?appId=${application.wid}`, {
                method: 'POST',  
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
    
            const data = await response.json();
    
            if (response.ok) {
                // Handle successful update here
                console.log('Update successful', data);
                onHide(); // Close the modal after successful update
            } else {
                // Handle errors here
                console.error('Update failed', data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if (show && application) {
            setEditableNotes('');
            if (application.notes != null) {
                const decodedNotes = he.decode(application.notes);
                setEditableNotes(`\n${decodedNotes}`);
            } 
            setDarsUpdatedBy(application.dars_updated_by || '');
            setSelectedStatus(application.status);
            fetchCourses(application.wid);
        }
    }, [show, application]);

    const handleNotesChange = e => { 
        const decodedInput = he.decode(e.target.value);
        setEditableNotes(decodedInput);
    };

    useEffect(() => { 
        const waiverRequested = courses.some(course => course.status === 'waiver-requested');
        setNotesBorder(waiverRequested);
    }, [courses]);

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header className={styles['modal-header-color']} closeButton>
                <Modal.Title>Review Application</Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles['modal-body-color']}>
                <Form>
                    <div className={styles['status-dars-container']}>
                        <Form.Group className={styles['status-group']}>
                            <Form.Label>Status</Form.Label>
                            <Form.Control as="select" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
                                <option value="Accpted">Accpted</option>
                                <option value="Pending">Pending</option>
                                <option value="Pending/Exception">Pending/Exception</option>
                                <option value="Pending/Dismissed">Pending/Dismissed</option>
                                <option value="Pending/Reinstated">Pending/Reinstated</option>
                                <option value="Pending(All)">Pending(All)</option>
                                <option value="Declined">Declined</option>
                                <option value="Declined/Exception">Declined/Exception</option>
                                <option value="Withdrawn">Withdrawn</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className={styles['dars-group']}>
                            <Form.Label>DARS Updated By</Form.Label>
                            <Form.Control
                                type="text"
                                value={darsUpdatedBy}
                                onChange={e => setDarsUpdatedBy(e.target.value)}
                            />
                        </Form.Group>
                    </div> 
                    <div className={styles['spacer']}></div> 
                    <Form.Group className={notesBorder ? styles['notes-border-red'] : ''}>
                        <Form.Label className={styles.notesLabel}>Notes</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={`${editableNotes}`}
                            onChange={handleNotesChange}
                            className={`${styles['notes-textarea']} ${notesBorder ? styles['notes-textarea-red'] : ''}`}
                        />
                    </Form.Group>
                    <div className={styles['spacer']}></div> 
                    <table className={styles['custom-review-table']}>
                        <thead>
                            <tr className={styles['review-table-header']}>
                                <th>Course</th>
                                <th>Status</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses && courses.map(course => (
                                <tr key={`${course.class_subject}-${course.class_catalog}`} className={styles[course.status.replace(/\s+/g, '-').toLowerCase()]}>
                                    <td>{`${course.class_subject} ${course.class_catalog}`}</td>
                                    <td>{course.status}</td>
                                    <td>{course.grade}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Form>
            </Modal.Body>
            <Modal.Footer className={styles['modal-header-color']}>
                <Button variant="secondary" onClick={onHide}>Close</Button>
                <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ReviewModal;
