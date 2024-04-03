import React, { useState } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';
import { Robot } from 'react-bootstrap-icons';
import Summarize from './Summarize';
import Questions from './Questions';
import Bullet from './Bullet';

// Updated AIComponent to accept an onClick prop
function AIComponent({ onClick }) {
  // Offcanvas logic remains the same
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [option, setOption] = useState('Questions');

  const renderOption = () => {
    switch (option) {
      case 'Summary':
        return <Summarize />;
      case 'List':
        return <Bullet />;
      case 'Questions':
        return <Questions />;
      default:
        return <p>Error</p>;
    }
  };

  return (
    <div className='ai-container'>
     
      <Button variant='primary' onClick={(e) => { handleShow(); onClick && onClick(e); }}>
        <Robot /> GPT
      </Button>

      {/* <Offcanvas show={show} onHide={handleClose} backdrop="static">
        <Offcanvas.Header closeButton className='ai-component-header'>
          <Offcanvas.Title className='dropdown-container-ai'>
            <h2>{option}</h2>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='ai-component-body'>
          {renderOption()}
        </Offcanvas.Body>
      </Offcanvas> */}
    </div>
  );
}

export default AIComponent;
