import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ApplicationForm from './components/forms/ApplicationForm.jsx';
import ProfilesForm from './components/forms/ProfilesForm.jsx';
import HomePage from './components/forms/HomePage.jsx';
import AdminForm from './components/forms/AdminForm.jsx';
import Header from './components/layout/Header.jsx';  
import Footer from './components/layout/Footer.jsx'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from './context/UserContext.jsx'; 
//import TicketForwarder from './utils/TicketForwarder.js';
import ProtectedAdminRoute from './components/common/ProtectedAdminRoute.jsx';
import ErrorPage from './components/common/ErrorPage.jsx';
import './App.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="appContainer"> 
          <Header/>
          <div className="contentBackground">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/Home" element={<HomePage />} />
              <Route path="/Apply" element={<ApplicationForm />} />
              <Route path="/Profile" element={<ProfilesForm />} />
              <Route path="/AdminPage" element={
                <ProtectedAdminRoute>
                  <AdminForm />
                </ProtectedAdminRoute>
              } />
              
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </div> 
          <Footer/>
        </div>
      </Router>
    </UserProvider> 
  );
}

export default App;
