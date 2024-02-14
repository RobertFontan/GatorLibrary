//import { useState } from 'react'
import { Routes, Route, BrowserRouter } from "react-router-dom"
import './App.css'

import { useLocation } from 'react-router-dom';


import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./routes/Login";
import Home from './routes/Home'
import Notes from './routes/Notes'
import Saved from './routes/Saved'
import Watching from './routes/Watching'

import NavBar from "./components/Navbar";

import { Container, Row, Col, Nav } from 'react-bootstrap'


function App() {

  // let location = useLocation();
  // const [showNavBar, setShowNavBar] = useState(true);

  // useEffect(() => {
  //   if (location.pathname === "/") {
  //     setShowNavBar(false);
  //   } else {
  //     setShowNavBar(true);
  //   }
  // }, [location]);


  return (
    <BrowserRouter>
      <Container fluid className="app-container">
        <Row className="App">
          {/* <Col lg={2} className="navbar-col">
            <NavBar />
          </Col> */}
          <Col className="content">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/watching" element={<Watching />} />
              <Route path="/watching/:course/:videoID" element={<Watching />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/saved" element={<Saved />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </BrowserRouter>
  )
}

export default App
