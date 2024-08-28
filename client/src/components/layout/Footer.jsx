import React from 'react';
import styles from '../../styles/Footer.module.css'; 
import { Container, Row, Col } from 'react-bootstrap';
import footerImage from '../../img/Footer2.jpg'; 
import footerImageSmall from '../../img/Footer.jpg';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <img src={footerImage} alt="Footer Background" className={styles.footerImg} />
      <img src={footerImageSmall} alt="Footer Background Small" className={styles.footerImgSmall} />  
      <Container className={styles.footerContent}>
       <Row>
         <Col xs={12} md={6} lg={3}>
           <p>Department of Computer Science<br />
           2184 Engineering Hall</p>
         </Col>
         <Col xs={12} md={6} lg={3}>
           <p>1701D Platt St., Manhattan, KS 66506</p>
         </Col>
         <Col xs={12} md={6} lg={3}>
           <p>785-532-6350 | 785-532-7353 fax | csoffice@k-state.edu</p>
         </Col>
         <Col xs={12} md={6} lg={3}>
           <p>Monday – Friday<br />
           8 a.m. – noon<br />
           1 p.m. – 5 p.m.</p>
         </Col>
       </Row>
     </Container>
   </footer>
  );
}
