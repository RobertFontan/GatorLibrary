import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import supabase from '../config/supabaseClient';
import './QuizModal.css'

const QuizModal = ({ showQuizModal, setShowQuizModal, videoId }) => {
    const [quizData, setQuizData] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(null);

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const { data, error } = await supabase
                    .from('quiz')
                    .select('content')
                    .eq('video_id', videoId)
                    .single();
    
                if (error) {
                    console.error('Supabase error:', error.message);
                    throw error;
                }
    
                if (data && data.content) {
                    if (typeof data.content === 'string') {
                        setQuizData(JSON.parse(data.content));
                    } else {
                        setQuizData(data.content);
                    }
                } else {
                    const response = await axios.post('http://localhost:5000/generate-questions', { videoId });
                    if (!response.data || !response.data.summary) {
                        console.error('Backup API returned no data');
                        throw new Error('No data received from backup questions generator.');
                    }
                    if (typeof response.data.summary === 'string') {
                        setQuizData(JSON.parse(response.data.summary));
                    } else {
                        setQuizData(response.data.summary);
                    }
                }
            } catch (error) {
                console.error('Fetching or parsing questions failed:', error);
                setQuizData([]); 
            }
        }
    
        fetchQuestions();
    }, [videoId]);
    
    

    const handleOptionChange = (questionIndex, option) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionIndex]: option 
        }));
    };

    const handleSubmit = async () => {
        setSubmitted(true);
        const percentageScore = calculateScore(); 
        setScore(percentageScore); 
        try {
            const { data, error } = await supabase
                .from('results')
                .insert([{
                    video_id: videoId,
                    user_id: userId,
                    answers: JSON.stringify(userAnswers),
                    score: percentageScore,  
                }]);

            if (error) throw error;
            console.log('Quiz results saved:', data);
        } catch (error) {
            console.error('Failed to save quiz results:', error.message);
        }
    };

      const calculateScore = () => {
        const totalQuestions = quizData.length;
        let correctAnswers = 0;
        quizData.forEach((question, index) => {
            if (userAnswers[index] === question.answer) {
                correctAnswers += 1;
            }
        });
        return (correctAnswers / totalQuestions) * 100;  
    };

    const renderQuizQuestions = () => {
        if (!quizData || quizData.length === 0) {
            return <p>Loading questions...</p>;
        }
        return quizData.map((question, index) => (
            <div key={index} style={{ paddingTop: index !== 0 ? '10px' : '0' }}>
                <p>{question.question}</p>
                <Form>
                    {Object.entries(question.options).map(([key, value]) => (
                        <Form.Check 
                        key={key}
                        className="custom-radio"
                        type="radio"
                        name={`question-${index}`}
                        id={`${index}-${key}`}
                        label={key + ": " + value}
                        onChange={() => handleOptionChange(index, key)}
                        checked={userAnswers[index] === key}
                        disabled={submitted}
                   />                     
                    ))}
                </Form>
                {submitted && <p style={{color: 'blue'}}>Correct answer: {question.options[question.answer]}</p>}
            </div>
        ));
    };
    

    return (
        <Modal show={showQuizModal} onHide={() => setShowQuizModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Quiz Time</Modal.Title>
            </Modal.Header>
            <Modal.Body>{renderQuizQuestions()}</Modal.Body>
            <Modal.Footer className="justify-content-between">
                {!submitted ? (
                    <div style={{ width: '100%', textAlign: 'center' }}> 
                        <Button variant="primary" onClick={handleSubmit}>Submit Answers</Button>
                    </div>
                    ) : (
                    <>
                        <p style={{ flex: 1 }}>Your score: {score ? `${score.toFixed(2)}%` : ''}</p>
                        <Button variant="secondary" onClick={() => setShowQuizModal(false)}>Close</Button>
                    </>
                 )}
            </Modal.Footer>
        </Modal>
    );
};

export default QuizModal;
