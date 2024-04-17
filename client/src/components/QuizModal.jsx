import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios'
import supabase from '../config/supabaseClient';

const QuizModal = ({ showQuizModal, setShowQuizModal, videoId }) => {

    const [quizData, setQuizData] = useState(null)


    useEffect(() => {
        const fetchQuestions = async () => {
            console.log('fetch called with', videoId)

            const { data, error } = await supabase
                .from('quiz')
                .select('content')
                .eq('video_id', videoId)
                .single()

            console.log('info', data, error)
            if (data)
            {
                console.log('AI QUESTIONS FROM SUPABASE ', data.content)
                const prettyJsonString = JSON.stringify(data.content, null, 2);
                setQuizData(prettyJsonString)            
                console.log('qdata', quizData)
            }
            else {
                try {
                    const response = await axios.post('http://localhost:5000/generate-questions', { videoID: videoId })
                    console.log('AI QUESTIONS', response.data)
                    const prettyJsonString = JSON.stringify(response.data.summary, null, 2);
                    setQuizData(prettyJsonString)
    
                } catch (error) {
                    console.error('ai question error', error)
                    setQuizData('Error Generating Questions, try again later :(')
                }
            }
            
        }
        fetchQuestions()
    }, [])


    const renderQuizQuestions = () => {
        // configure json
        return (
            <p>{quizData}</p>
        )

    }


    return (
        <Modal show={showQuizModal} onHide={() => setShowQuizModal(false)} dialogClassName="fullscreen-modal">
            <Modal.Header closeButton>
                <Modal.Title>Quiz Time</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Quiz Questions HERE */}
                {renderQuizQuestions()}

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
