import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { FaTrashAlt, FaPenAlt } from 'react-icons/fa';
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


const Offre = () => {
  const [offres, setOffres] = useState([]);
  const [devis, setDevis] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOffres, setFilteredOffres] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [offresToDelete, setOffresToDelete] = useState(null);
  const [newOffres, setNewOffres] = useState({
    titre:'',
    prix:'', 
    uniter:'', 
    contenus:'', 
    reference:'',
    date_de_publication:'', 
    
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [offresPerPage] = useState(5);


  useEffect(() => {
    fetchOffres();
    fetchDevis();
  }, []);

  const fetchDevis = async () => {
    try {
      const response = await axios.get('/Devis');
      setDevis(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des offres:", error);
    }
  };

  const fetchOffres = async () => {
    try {
      const response = await axios.get('/Offres');
      setOffres(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des offres:", error);
    }
  };


  const handleShow = (mode, offres = null) => {
    setModalMode(mode);
    if (mode === 'edit' && offres) {
      setNewOffres(offres);
    } else {
      setNewOffres({
        titre:'',
        prix:'', 
        uniter:'', 
        contenus:'', 
        reference:'',
        date_de_publication:'', 

      });
    }
    setShowModal(true);
    setModalPage(1);
  };

  const handleClose = () => setShowModal(false);
  const handleCloseConfirmModal = () => setShowConfirmModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOffres({
      ...newOffres,
      [name]: value
    });
  };

 


  // ajouter le donner au table devis
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await axios.post('/Offres', newOffres);
        setAlert({ show: true, message: 'Offres ajouté avec succès.', variant: 'success' });
      } else {
        await axios.put(`/Offres/${newOffres.id}`, newOffres);
        setAlert({ show: true, message: 'Offres mis à jour avec succès.', variant: 'success' });
      }
      fetchOffres();
      handleClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout/modification d'offre:", error);
      setAlert({ show: true, message: `Échec de l'opération: ${modalMode === 'add' ? 'ajout' : 'mise à jour'} d'offre.`, variant: 'danger' });
    }
  };

  //modifier le donner au table devis
  const editOffres = (Offres) => {
    setSelectedOffres(Offres);
    setNewOffres({
      titre: Offres.titre,
      prix: Offres.prix,
      uniter: Offres.uniter,
      contenus: Offres.contenus,
      reference:Offres.reference,
      date_de_publication: Offres.date_de_publication,
      
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/Offres/${setSelectedOffres.id}`, newOffres);
      fetchOffres();
      setAlert({ show: true, message: 'Offre mis à jour avec succès.', variant: 'success' });
      handleClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour d'offre:", error);
      setAlert({ show: true, message: "Échec de la mise à jour d'offre.", variant: 'danger' });
    }
  };

  // Fonction pour ouvrir la boîte de confirmation avant suppression
  const confirmDelete = (Offres) => {
    setOffresToDelete(Offres);
    setShowConfirmModal(true); // Afficher la boîte de confirmation
  };

  const deleteOffres = async () => {
    try {
      await axios.delete(`/Offres/${offresToDelete.id}`);
      fetchOffres();  // Rafraîchir la liste des contacts après suppression
      setShowConfirmModal(false); // Fermer la boîte de confirmation
    } catch (error) {
      console.error("Erreur lors de la suppression d'offres:", error);
    }
  };
  const indexOfLastOffres = currentPage * offresPerPage;
  const indexOfFirsOffres = indexOfLastOffres - offresPerPage;
  const currentOffres = filteredOffres.slice(indexOfFirsOffres, indexOfLastOffres);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Réinitialiser à la première page
};

useEffect(() => {
  const filteredOffre = offres.filter(offre => {
    const matchesSearchQuery =
      offre.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offre.prix.toString().toLowerCase().includes(searchQuery.toLowerCase()) || // Convertir prix en string
      offre.uniter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offre.contenus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offre.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offre.date_de_publication.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearchQuery;
  });

  setFilteredOffres(filteredOffre);
}, [offres, searchQuery]); // Dépendances pour mettre à jour filteredOffres


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
          <Link to='/GestionOffre' className="btn btn-outline-secondary  text-dark">
            <i className="bi bi-cart3"> Presentation des offres</i>
          </Link>{' '}
          <Link to='/GestionDeDevis' className='ms-2 btn btn-outline-secondary  text-dark'>
            <i className="bi bi-cash-coin"> Gestion des devis</i>
          </Link>{' '}
          <Link to='/GererOffre' className='ms-2 btn btn-outline-secondary  text-dark'>
            <i className="bi bi-cart3"> Gestion des offres</i>
          </Link>
        </div>
      </div>
      <div className="card mb-4 mt-4">
        <div className="card-header text-white" style={{ background: '#72A0C1'}}>
          <h5>Gestion d'offres</h5>
        </div>
      </div>
        

      {/* Offre Table */}
    <div className="liste card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between mb-3">
          <button className="btn btn-info" onClick={() => handleShow('add')}>+ Nouveau offre</button>
          <input type="text" className="form-control w-25" placeholder="Rechercher" value={searchQuery} onChange={handleSearchChange}/>
        </div>
        <div className='align-items-center justify-content-center bg-dark'>
          <h4 className='text-light'>Liste des offres</h4>
        </div>
      <div className="table-responsive mt-4">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Prix</th>
              <th>Uniter</th>
              <th>Contenus</th>
              <th>Reference</th>
              <th>Date de publication</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {currentOffres.map(offre => (
              <tr key={offre.id}>
                <td>{offre.titre}</td>
                <td>{offre.prix}</td>
                <td>{offre.uniter}</td>
                <td>{offre.contenus}</td>
                <td>{offre.reference}</td>
                <td>{offre.date_de_publication}</td>
                <td className='d-flex ms-1'>
                  <Button variant="outline-primary  " size="sm" onClick={() => handleShow('edit', offre)}>
                  <FaPenAlt />
                  </Button>
                  <Button variant="outline-danger ms-1" size="sm"  onClick={() => confirmDelete(offre)}>
                  <FaTrashAlt />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            {Array.from({ length: Math.ceil(filteredOffres.length / offresPerPage) }, (_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button onClick={() => paginate(i + 1)} className="page-link">{i + 1}</button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      </div>

      {/* Modal for adding/editing offers */}
      <Modal show={showModal} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Header closeButton style={{background:'#72A0C1'}} className='text-light'>
            <Modal.Title >{modalMode === 'add' ? 'Ajout Offres' : 'Modifier Offres'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <div className="row py-4 px-3">
                <div className="col-md-6">
                  <Form.Group controlId="titre">
                    <Form.Label>Titre</Form.Label>
                    <Form.Control
                      type="text"
                      name="titre"
                      value={newOffres.titre}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="prix">
                    <Form.Label>Prix</Form.Label>
                    <Form.Control
                      type="number"
                      name="prix"
                      value={newOffres.prix}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="uniter">
                  <Form.Label>Uniter</Form.Label>
                  <Form.Select
                    name="uniter"
                    value={newOffres.uniter}
                    onChange={handleInputChange}
                    required
                  >
                  <option value="">-- Sélectionnez l'Uniter --</option>
                  <option value="£" className='text-success'>£</option>
                  <option value="$" className='text-warning'>$</option>
                  <option value="Ar" className='text-primary'>Ar</option>
                  </Form.Select>

                  </Form.Group>
                </div>
                <div className="col-md-6">
                   <Form.Group controlId="contenus">
                    <Form.Label>Contenus</Form.Label>
                    <Form.Control
                     as="textarea" aria-label="With textarea"
                      type="text"
                      name="contenus"
                      value={newOffres.contenus}
                      onChange={handleInputChange}
                    />
                  </Form.Group> 
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="reference">
                    <Form.Label>Reference</Form.Label>
                    <Form.Select
                      id="contactSelect"
                      name='reference'
                      className="form-select"
                      value={newOffres.reference}
                      onChange={handleInputChange}
                    >
                      <option value="">-- Sélectionnez le reference --</option>
                      {devis.map((devisOffres) => (
                        <option key={devisOffres.id} value={devisOffres.id}>
                          {devisOffres.reference}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="date_de_publication">
                    <Form.Label>Date de publication</Form.Label>
                    <Form.Control
                      type="date"
                      name="date_de_publication"
                      value={newOffres.date_de_publication}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </div>
                </div>
                 
                  <Button variant="primary" type="submit" className="mt-3">
                    {modalMode === 'add' ? 'Ajouter' : 'Mettre à jour'}
                  </Button>
                  <Button variant="dark" type="button" className="mt-3 ms-3" onClick={handleClose}>
                    Annuler
                  </Button>
             
            </Form>
          </Modal.Body>
        </Modal>
        <Modal show={showConfirmModal} onHide={handleCloseConfirmModal} aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Header closeButton style={{ background: '#72A0C1'}}>
            <Modal.Title>Confirmation de suppression</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Êtes-vous sûr de vouloir supprimer l'offre "{offresToDelete?.titre}" ?
          </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmModal}>
            Annuler
          </Button>
          <Button variant="danger" onClick={deleteOffres}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>
  );
};

export default Offre;
