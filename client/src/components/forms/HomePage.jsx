import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import styles from '../../styles/HomePage.module.css'; 
import { ApplyButton } from '../common/Button';

function HomePage() { 
  return (
    <div className={styles.HomePage}>
      <Container>
        <div className={styles.appHeader}>
          <h1 className={styles.h1Style}>CS Applications</h1>
          <h4 className={styles.h4Style}>Welcome to the CS Applications System</h4>
        </div>
      </Container>

      <Container>
        <Row className="gx-2">
          <Col md={5} className={styles.boxStyle} style={{ backgroundColor: '#d1d1d1'}}> {/* Bootstrap's is made up of Grid which contains Row and Col, each row have 12 cols,
                                  md={6} means screen size >=768px will have Requirements and Apply side by side
                                  screen size < 768px will have Requirements and Apply vertically stacked
                                  This is because col default to 12 when the case is not specified, in this case
                                  is sm and xs */}
            <h2 className={styles.h2Style}>Requirements</h2>
            <p>In order to be considered for admission to the professional program, a student must have:</p>
            <ol className={styles.customList}>
              <li>Passed all pre-professional program courses with a C or better</li>
              <li>Achieved at least a 2.3 GPA on all pre-professional courses (including transfer courses)</li>
            </ol>
          </Col>  
          <Col md={{ span: 5, offset: 2 }} className={styles.applyBoxStyle} style={{ backgroundColor: '#d1d1d1'}}>
            <h2 className={styles.h2Style}>Apply</h2>
            <p className={styles.pStyleApply}>When you are ready to apply, click the button below!</p>
            <br/> 
            <Link to="/Apply" className={styles['link-no-decoration']}> 
              <div className={styles.buttonContainer}>
                <ApplyButton/> 
              </div>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HomePage;
