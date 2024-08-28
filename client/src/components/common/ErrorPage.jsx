import React from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/ErrorPage.css'

function ErrorPage() {
  const location = useLocation();
  const message = location.state?.message || 'A Happy Little Accident (The page you are viewing does not exist 😞)';

  return (
    <div style={{position: "relative", textAlign: "center"}}>
      <div style={{backgroundColor: "#512888", margin: "10px auto", width: "70%", border: "3px solid #fff", borderRadius: "10px"}}>

<h1 style={{fontSize: "80px", fontWeight: "600", color: "#fff"}}>Error Page</h1>

<p style={{fontSize: "30px",  color: "#fff"}}>{message}</p>

</div>
      
      <img src="https://media.gettyimages.com/id/50467803/photo/tv-painting-instructor-artist-bob-ross-jubiantly-holding-up-paint-pallette-brushes-as-he-stands.jpg?s=612x612&w=0&k=20&c=LMajXi9w9M1LnnNfBcaIbiXZb6dICIQq48hS8Mo-xWQ=" alt="Bob Ross"></img>
    </div>
  );
}

export default ErrorPage;
