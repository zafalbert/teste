import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import './Presentation.css';
import axios from 'axios';

const HistoriqueEmail = () => {
  const [stats, setStats] = useState({
    unread: 0,
    received: 0,
    sent: 0,
    deleted: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        setLoading(true);
        const response = await axios.get('/api/email-stats', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.data
            console.log(errorData);
            throw new Error(errorData.error || `HTTP error! status: ${response}`);
            
        }

        const data = await response.data;
        setStats({
            unread: data.unread || 0,
            received: data.received || 0,
            sent: data.sent || 0,
            deleted: data.deleted || 0
        });
        console.log(data);
    } catch (error) {
      console.log()
        console.error('Erreur lors de la récupération des statistiques:', error);
        setError(error.message);
    } finally {
        setLoading(false);
    }
};

  return (
    <Container className="presentation-container">
      <div className="mt-3">
        <Link to="/SuivieInteraction" className="btn btn-outline-primary">
          <i className="bi bi-bank2"> Gestion de résumer</i>
        </Link>
        <Link to="/HistoriqueAppel" className="ms-2 btn btn-outline-primary">
          <i className="bi bi-telephone-fill"> Historique d'appel</i>
        </Link>
        <Link to="/HistoriqueEmail" className="ms-2 btn btn-outline-primary">
          <i className="bi bi-envelope-at"> Historique email</i>
        </Link>
      </div>

      <div className="bg-white rounded shadow mt-4">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Statistiques des emails</h2>
        </div>
        <div className="p-4">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Date</th>
                <th>Messages non lus</th>
                <th>Messages reçus</th>
                <th>Messages envoyés</th>
                <th>Messages supprimés</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{new Date().toLocaleDateString()}</td>
                <td>{stats.unread}</td>
                <td>{stats.received}</td>
                <td>{stats.sent}</td>
                <td>{stats.deleted}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
};

export default HistoriqueEmail;