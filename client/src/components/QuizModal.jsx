import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

import supabase from '../config/supabaseClient';
import { useSession } from '../components/SessionContext';


const QuizModal = ({ showQuizModal, setShowQuizModal, videoData }) => {

    const session = useSession()


    const [quizData, setQuizData] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(null);

    const fetchTranscriptData = async (videoId) => {
        console.log('fetching transcript data')
        const options = {
            method: 'GET',
            url: 'https://youtube-captions.p.rapidapi.com/onlycaption',
            params: {
                videoId: videoId
            },
            headers: {
                'X-RapidAPI-Key': '3bbf868d53msh78af357de335f9ap1536a6jsn20da07fcbe43',
                'X-RapidAPI-Host': 'youtube-captions.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        //setTranscript(response.data) // text transcript

        const newInfo = response.data;

        const { data, error } = await supabase
            .from('notes')
            .upsert({ videoId: videoId, transcript: newInfo })
            .eq('profile_id', session.user.id)


        if (data) {
            console.log('update successful data inserted', data)
        }
        if (error) {
            console.log('update error', error)
        }
        console.log('update done')

        return response.data;
    }




    useEffect(() => {
        async function fetchQuestions() {

            const { data, error } = await supabase
                .from('quiz')
                .select('content')
                .eq('video_id', videoData.videoID)
                .single();

            if (error) {
                console.error('Supabase error:', error.message);
            }

            if (data && data.content) {
                if (typeof data.content === 'string') {
                    setQuizData(JSON.parse(data.content));
                } else {
                    setQuizData(data.content);
                }
            } else {
                // getting transcript
                console.log('getting transcript')
                const videoID = videoData.videoID;


                const transcript = await fetchTranscriptData(videoID);

                const response = await axios.post('http://localhost:5000/generate-questions', { videoID, transcript  });
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

        }

        fetchQuestions();
    }, [videoData]);



    const handleOptionChange = (questionIndex, option) => {
        setUserAnswers(prev => ({ ...prev, [questionIndex]: option }));
    };

    const handleSubmit = async () => {
        setSubmitted(true);
        const percentageScore = calculateScore();
        setScore(percentageScore)
        console.log('Score:', percentageScore);

        const { data, error } = await supabase
            .from('results')
            .insert([{
                video_id: videoData.videoID,
                user_id: session.user.id,
                video_name: videoData.title,
                score: percentageScore
            }]);

        if (data) {
            console.log('QUIZ data inserted', data)
        }
        if (error) {
            console.log('QUIZ error inserting data', error)
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
        return (correctAnswers / totalQuestions) * 100
    };

    const renderQuizQuestions = () => {
        if (!quizData || quizData.length === 0) {
            return <p>Loading questions...</p>;
        }
        return quizData.map((question, index) => (
            <div key={index}>
                <p>{question.question}</p>
                <Form>
                    {Object.entries(question.options).map(([key, value]) => (
                        <Form.Check
                            key={key}
                            type="radio"
                            name={`question-${index}`}
                            id={`${index}-${key}`}
                            label={`${key}: ${value}`}
                            onChange={() => handleOptionChange(index, key)}
                            checked={userAnswers[index] === key}
                            disabled={submitted}
                        />
                    ))}
                </Form>
                {submitted && <p>Correct answer: {question.options[question.answer]}</p>}
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
