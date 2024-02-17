//import { useState } from 'react'
import { Link, Routes, Route, BrowserRouter} from "react-router-dom"
import './App.css'


import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./routes/Login";
import Home from './routes/Home'
import Notes from './routes/Notes'
import Saved from './routes/Saved'
import Watching from './routes/Watching'
import NavBar from "./components/Navbar";
import SignUp from './routes/SignUp'; 
import StartUp from './routes/StartUp';


import { Container, Row, Col, Nav } from 'react-bootstrap'


function App() {

  return (
    <BrowserRouter>
      <Container fluid className="app-container">
        {/* <div className='App'> */}
          <Row className="App">
            {/* <Col lg={2} className="navbar-col">
              <NavBar />
            </Col> */}
            <Col className="content">
              <Routes>
                 <Route path="/" element={<StartUp />}/>
                 <Route path="/login" element={<Login/>}/>
                 <Route path="/signup" element={<SignUp />}/>
                   {/* <Route path="/" element={<Home />}/> */}
                   <Route path="/watching" element={<Watching />}/>
                   <Route path="/watching/:course/:videoID" element={<Watching />}/>
                   <Route path="/notes" element={<Notes />}/>
                   <Route path="/saved" element={<Saved />}/>
              </Routes>
            </Col>
          </Row>
        {/* </div> */}
      </Container>
    </BrowserRouter>
  )
}

export default App
