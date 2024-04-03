import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const QuizModal = ({ showQuizModal, setShowQuizModal }) => {
    return (
        <Modal show={showQuizModal} onHide={() => setShowQuizModal(false)} dialogClassName="fullscreen-modal">
            <Modal.Header closeButton>
                <Modal.Title>Quiz Time</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Quiz Questions HERE */}
                Here will be the quiz questions.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowQuizModal(false)}>
                    Close
                </Button>
                <Button variant="primary">
                    Submit Answers
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default QuizModal;
