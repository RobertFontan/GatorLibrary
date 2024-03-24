
import React from 'react';
import { Col } from 'react-bootstrap'
import courses from '../data/courses'
import Course from '../components/Course'

/* Components */

import { useSession } from '../components/SessionContext';


// dummy info
import explore from "../data/explore"
/* Bootstrap  */



function DegreeChecklist() {
    console.log(courses)
  return (

    <div>
        <h1>Degree Checklist</h1>
        <div class="container"> 

    <div id="accordion">
    {courses && courses.map((course)=> (<div className='card'> 

        <div class="card-header" id="headingOne">
        <h5 class="mb-0">
            <button class="DCbutton" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" color ="white">
            {course.title}
            </button>
        </h5>
        </div>
        <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
        <div class="card-body">
            Recommended Videos:
            <Col lg={9} className='left-screen'>
               <Course  course ={course} />
                {/* {courses.map(course => <Course course={course} />)} */}
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

