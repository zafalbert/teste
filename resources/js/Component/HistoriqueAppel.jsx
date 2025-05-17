import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Contact.css';

const alertStyle = {
  position: 'fixed',
  top: '6.8rem',
  right: '20px',
  width: '300px',
  zIndex: 9999,
  padding: '-2px',
  height:'2vh'
};

const HistoriqueAppel = () => {
  const [resumers, setResumer] = useState([]);
  const [filteredAppels, setFilteredAppels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [appelsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    fetchResumer();
  }, []);

  const fetchResumer = async () => {
    try {
      const response = await axios.get('/Resumer');
      setResumer(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des offres:", error);
    }
  };

  // Gestion de la recherche
  useEffect(() => {
    const filtered = resumers.filter(resumer =>
      resumer.type_source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resumer.entreprise.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resumer.date_resumer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAppels(filtered);
    setCurrentPage(1);
  }, [searchQuery, resumers]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Pagination
  const indexOfLastAppel = currentPage * appelsPerPage;
  const indexOfFirstAppel = indexOfLastAppel - appelsPerPage;
  const currentAppels = filteredAppels.slice(indexOfFirstAppel, indexOfLastAppel);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="contact-container container">
      {alert.show && (
        <div style={alertStyle}>
          <Alert 
            variant={alert.variant} 
            onClose={() => setAlert({ show: false })} 
            dismissible
          >
            {alert.message}
          </Alert>
        </div>
      )}

      <div className='mt-3'>
        <div className='mt-3'>
          <Link to='/SuivieInteraction' className="btn btn-outline-secondary text-dark">
            <i className="bi bi-bank2"> Gestion de resumer</i>
          </Link>{' '}
          <Link to='/HistoriqueAppel' className='ms-2 btn btn-outline-secondary  text-dark'>
          <i class="bi bi-telephone-fill"> Historique d'appel</i>
          </Link>{' '}
          {/* <Link to='/HistoriqueEmail' className='ms-2 btn btn-outline-secondary text-dark'>
            <i className="bi bi-envelope-at"> Historique email</i>
          </Link> */}
        </div>
      </div>

      <div className="card mb-4 mt-4">
        <div className="card-header text-white" style={{ background: '#72A0C1'}}>
          <h5>Historique des appels</h5>
        </div>
      </div>

      <div className="liste card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <input 
              type="text" 
              className="form-control w-25" 
              placeholder="Rechercher" 
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className='align-items-center justify-content-center bg-dark'>
            <h4 className='text-light'>Liste des appels</h4>
          </div>
          <div className="table-responsive mt-4">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Type d'appel</th>
                  <th>Client</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {currentAppels.map(resumer => (
                  <tr key={resumer.id}>
                    <td>{resumer.type_source}</td>
                    <td>{resumer.entreprise}</td>
                    <td>{resumer.date_resumer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-center">
            <nav>
              <ul className="pagination">
                {Array.from({ length: Math.ceil(filteredAppels.length / appelsPerPage) }, (_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <button onClick={() => paginate(i + 1)} className="page-link">{i + 1}</button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoriqueAppel;