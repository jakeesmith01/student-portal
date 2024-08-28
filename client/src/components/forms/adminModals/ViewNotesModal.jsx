import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import he from 'he';
import styles from '../../../styles/AdminForm.module.css';

function ViewNotesModal({ show, onHide, notes, onSave }) {
    const [editableNotes, setEditableNotes] = useState(notes); 
 
    useEffect(() => {
        if (show) { 
          const decodedNotes = he.decode(notes);
          setEditableNotes(`\n${decodedNotes}`);
        }
    }, [notes, show]);

    const handleSave = () => {
        onSave(editableNotes);
        onHide();
    };
    
    return (
        <Modal className={styles['notes-modal']} show={show} onHide={onHide} size="lg" centered >
            <Modal.Header closeButton className={styles['modal-header-color']}>
                <Modal.Title id="contained-modal-title-vcenter">
                    Admin Notes
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles['modal-body-color']}>
                <Form.Control
                    as="textarea"
                    className={styles['textarea-notes']}
                    value={`${editableNotes}`}
                    onChange={(e) => setEditableNotes(e.target.value)} 
                />
            </Modal.Body>
            <Modal.Footer className={styles['modal-header-color']}>
                <Button onClick={handleSave} variant="success">Save</Button>
                <Button onClick={() => { onHide(); setEditableNotes(''); }}>Close</Button>
            </Modal.Footer>
      </Modal>
  );
}

export default ViewNotesModal;
