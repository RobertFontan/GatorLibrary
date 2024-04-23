import React from 'react';
import { Col } from 'react-bootstrap';
import courses from '../data/courses';
import Course from '../components/Course';
import { useSession } from '../components/SessionContext';
import explore from "../data/explore";

function DegreeChecklist() {
    console.log(courses);
    return (
        <div>
            <h1>Degree Checklist</h1>
            <div className="container">
                <div id="accordion">
                    {courses && courses.map((course, index) => (
                        <div className='card' key={index}>
                            <div className="card-header" id={`heading${index}`}>
                                <h5 className="mb-0">
                                    <button className="DCbutton" data-toggle="collapse" data-target={`#collapse${index}`} aria-expanded="true" aria-controls={`collapse${index}`} color="white">
                                        {course.title}
                                    </button>
                                </h5>
                            </div>
                            <div id={`collapse${index}`} className="collapse show" aria-labelledby={`heading${index}`} >
                                <div className="card-body">
                                    Recommended Videos:
                                    <Col lg={9} className='left-screen'>
                                        <Course course={course} />
                                    </Col>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DegreeChecklist;
