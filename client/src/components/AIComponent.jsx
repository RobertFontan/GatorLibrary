import React, { useState } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';
import { Robot } from 'react-bootstrap-icons';


// Updated AIComponent to accept an onClick prop
function AIComponent({ onClick }) {
  // Offcanvas logic remains the same
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className='ai-container'>
      <Button variant='primary' onClick={(e) => { handleShow(); onClick && onClick(e); }}>
        <Robot /> GPT
      </Button>
    </div>
  );
}

export default AIComponent;
