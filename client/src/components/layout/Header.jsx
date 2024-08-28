import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../img/ksuLogo.png';
import styles from '../../styles/Header.module.css';
import { UserContext  } from '../../context/UserContext';
import {Button } from 'react-bootstrap';

export default function Header() {  
  const logout = () => {
    window.location = '/api/logout';
  };
  const user = useContext(UserContext);
  
  const showAdminLink = user && user.admin;

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerTop}>
        <a href="https://ksu.edu">
           <img src={logo} alt="Logo" className={styles.logo} />
        </a>
        <div className={styles.divider}></div>
          <a style={{ textDecoration: 'none' }} href="https://cs.ksu.edu">
            <h1 className={styles.headerTitle}>Computer Science Student Portal</h1>
        </a>
        <Button
          onClick={logout}
          variant={'danger'}
          style={{ marginLeft: 'auto', marginRight: '1rem' }}
        >
          Logout
        </Button>
      </div>
      <nav className={styles.navSection}>
        <ul className={styles.navList}>
          <li className={styles.navItemContainer}>
            <Link to="/Home" className={styles.navItem}>CS Applications</Link>
            <div className={styles.dividerNav}></div>
          </li>
          <li className={styles.navItemContainer}>
            <Link to="/Apply" className={styles.navItem}>Apply</Link>
            <div className={styles.dividerNav}></div>
          </li>
          <li className={styles.navItemContainer}>
            <Link to="/Profile" className={styles.navItem}>Profile</Link>
          </li>
          {showAdminLink && (
            <li className={styles.navItemContainer}>
              <div className={styles.dividerNav}></div>
              <Link to="/AdminPage" className={styles.navItem}>Admin</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
  