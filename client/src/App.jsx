import { Link, Routes, Route, BrowserRouter, useLocation } from "react-router-dom"
import './App.css'


import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./routes/Login";
import Home from './routes/Home'
import Notes from './routes/Notes'
import Saved from './routes/Saved'
import Watching from './routes/Watching'
import Profile from './routes/Profile'

import Pomodoro from './routes/Pomodoro'

import DegreeChecklist from "./routes/DegreeChecklist";



import NavBar from "./components/Navbar";
import SignUp from './routes/SignUp';
import StartUp from './routes/StartUp';


import { SessionProvider } from "./components/SessionContext";

import { Container, Row, Col, Nav } from 'react-bootstrap'


const AppContent = () => {
  const location = useLocation(); // Get current location
  const showNavBar = location.pathname !== '/' && location.pathname !== '/signup' && location.pathname !== '/login'; // Determine whether to show NavBar

  return (
    <Container fluid className="app-container">
      <Row className="App">
        {showNavBar && (
          <Col lg={2} className="navbar-col">
            <NavBar />
          </Col>
        )}
        <Col className={showNavBar ? "content" : "content-full-width"}>
          <Routes>
            <Route path="/" element={<StartUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<Home />} />
            <Route path="/watching" element={<Watching />} />
            <Route path="/watching/:course/:videoID" element={<Watching />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/saved" element={<Saved />} />

            <Route path="/profile" element={<Profile />}/>
            <Route path="/pomodoro" element={<Pomodoro />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dc" element={<DegreeChecklist />} />

          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

const App = () => {
  return (
    <SessionProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </SessionProvider>
  );
};

export default App;
