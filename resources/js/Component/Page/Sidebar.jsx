import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import './Sidebar.css';
import { Link, useLocation } from 'react-router-dom';

function Sidebar({ isVisible }) {
  const location = useLocation();

  return (
    <aside id='sidebar' className={`sidebar ${isVisible ? '' : 'd-none'}`} style={{width: '230px', position: 'fixed', marginTop: '5rem', backgroundColor: '#f8f9fa'}}>
      <ul className="sidebar-nav list-unstyled p-2" id='sidebar-nav'>

        <li className="nav-item">
          <Link to='/Accueil' className={`nav-link d-flex align-items-center ${location.pathname === '/Accueil' ? 'active-link' : ''}`}>
            <i className="bi bi-bank2 me-2"></i> Acceuil
          </Link>
        </li>

        <span className='text-secondary ms-3 mt-4'>SUIVIE</span>
        <li className="nav-item mt-2">
          <Link to='/GestionDeTache' className={`nav-link d-flex align-items-center ${location.pathname === '/GestionDeTache' ? 'active-link' : ''}`}>
            <i className="bi bi-list-task me-2"></i> Gestion de tache
          </Link>
        </li>
        <li className="nav-item mt-2">
          <Link to='/GestionProspection' className={`nav-link d-flex align-items-center ${location.pathname === '/GestionProspection' ? 'active-link' : ''}`}>
            <i className="bi bi-arrow-left-right me-2"></i> Gestion des prospections
          </Link>
        </li>
        <li className="nav-item mt-2">
          <Link to='/GestionOffre' className={`nav-link d-flex align-items-center ${location.pathname === '/GestionOffre' ? 'active-link' : ''}`}>
            <i className="bi bi-coin me-2"></i> Gestion devis/offres
          </Link>
        </li>
        <li className="nav-item mt-2">
          <Link to='/GestionDeDocument' className={`nav-link d-flex align-items-center ${location.pathname === '/GestionDeDocument' ? 'active-link' : ''}`}>
            <i className="bi bi-filetype-doc me-2"></i> Gestion des documents
          </Link>
        </li>
        <li className="nav-item mt-2">
          <Link to='/SuivieInteraction' className={`nav-link d-flex align-items-center ${location.pathname === '/SuivieInteraction' ? 'active-link' : ''}`}>
            <i className="bi bi-crosshair me-2"></i> Suivie interaction
          </Link>
        </li>
        <li className="nav-item mt-2">
          <Link to='/Rapport' className={`nav-link d-flex align-items-center ${location.pathname === '/Rapport' ? 'active-link' : ''}`}>
            <i className="bi bi-graph-up-arrow me-2"></i> Rapport
          </Link>
        </li>

        <span className='text-secondary ms-3 mt-3'>DONNER RH</span>
        <li className="nav-item">
          <Link to='/GestionEmployer' className={`nav-link d-flex align-items-center ${location.pathname === '/GestionEmployer' ? 'active-link' : ''}`}>
            <i className="bi bi-file-person me-2"></i> Gestion employées
          </Link>
        </li>

        <span className='text-secondary ms-3 mt-3'>ADMINISTRATION</span>
        <li className="nav-item ">
          <Link to='/GestionUtilisateur' className={`nav-link d-flex align-items-center ${location.pathname === '/GestionUtilisateur' ? 'active-link' : ''}`}>
            <i className="bi bi-people me-2"></i> Gestion Utilisateur
          </Link>
        </li>

      </ul>
    </aside>
  );
}

export default Sidebar;
