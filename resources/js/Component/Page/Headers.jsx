import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSignOutAlt, FaBars, FaTimes, FaBell } from 'react-icons/fa';
import './Headers.css';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { useNotifications } from '../NotificationContext';

function Headers({ toggleSidebar }) {
  const [taches, setTaches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { newTasks } = useNotifications();

  useEffect(() => {
    const fetchTaches = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/Taches');
        setTaches(response.data);
        setError(null);
      } catch (error) {
        console.error('Erreur lors de la récupération des tâches:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTaches();
  }, []);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    toggleSidebar();
  };

  const handleTaskClick = (tache) => {
    if (tache.lien_angenda) {
      window.open(tache.lien_angenda, '_blank');
    }
  };

  const renderTaskContent = () => {
    if (newTasks.length === 0) {
      return <Dropdown.Item>Aucune tâche à afficher</Dropdown.Item>;
    }

    return newTasks.map((tache, index) => (
      <Dropdown.Item
        key={tache.id || index}
        as="div"
        className="notification-item"
        onClick={() => handleTaskClick(tache)}
      >
        <h6><strong>Intitulé:</strong> <span className='text-success'>{tache.intitule}</span></h6>
        <p className="mb-1"><strong>Intervenant:</strong> <span className='text-success'>{tache.nom}</span></p>
        <p className="mb-1"><strong>Date prévue:</strong> {tache.date_prevus}</p>
        <p className="mb-1"><strong>Agenda:</strong> <span>{tache.lien_angenda}</span></p>
        {index < newTasks.length - 1 && <hr className="my-2" />}
      </Dropdown.Item>
    ));
  };

  return (
    <header className='header fixed-top d-flex align-items-center justify-content-between px-3' style={{ height: '11vh' }}>
      <div className="logo d-flex align-items-center" style={{ gap: '1.5rem' }}>
        <a href="#" className="d-flex align-items-center text-decoration-none mt-1">
          <img src="/crm-logo.png" alt="Logo" style={{ width: 100, height: 65 }} />
          <span className='text-primary ms-2' style={{ fontSize: '1.5rem', fontWeight: '350' }}>CRM</span>
        </a>
        <div style={{ cursor: 'pointer' }} onClick={handleToggleSidebar}>
          {sidebarOpen ? (
            <FaTimes size={30} className="text-dark" />
          ) : (
            <FaBars size={30} className="text-dark" />
          )}
        </div>
      </div>

      <nav className="header-nav">
        <ul className="list d-flex align-items-center m-0">
          <li className="nav-item p-3">
            <Dropdown>
              <Dropdown.Toggle
                variant="dark"
                id="notification-dropdown"
                className="bg-transparent border-0 text-dark"
              >
                <FaBell style={{ marginRight: 5 }} />
                {newTasks.length > 0 && (
                  <span className="badge bg-danger badge-number">{newTasks.length}</span>
                )}
                  <img src="/images/Image1.png" alt="Logo" style={{width: 100, height: 85}} className='mt-2' />
              </Dropdown.Toggle>

              <Dropdown.Menu align="end" className="notifications p-0">
                <Dropdown.Header className="py-2 px-3 border-bottom">
                  Vous avez {newTasks.length} tâche(s) en retard
                </Dropdown.Header>
                {renderTaskContent()}
              </Dropdown.Menu>
            </Dropdown>
          </li>

          <li className="nav-item p-3">
            <Link
              to='/login'
              className="nav-link text-decoration-none btn btn-danger d-flex align-items-center gap-2"
            >
              <FaSignOutAlt /> Déconnecter
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Headers;
