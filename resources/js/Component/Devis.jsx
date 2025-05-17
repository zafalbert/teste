import generatePDF from './DevisPDFGenerator';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { FaTrashAlt, FaPenAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Presentation.css';
import './Contact.css';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const alertStyle = {
  position: 'fixed',
  top: '6.8rem',
  right: '20px',
  width: '300px',
  zIndex: 9999,
  padding: '-2px',
  height:'2vh'
};


const Devis = () => {
  const [devis, setDevis] = useState([]);
  const [filteredDevis, setFilteredDevis] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    reference:'',
    client:'', 
    designation:'', 
    date:'',
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [contacts, setContacts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [devisToDelete, setDevisToDelete] = useState(null);
  const [modalPage, setModalPage] = useState(1);
  const [newDevis, setNewDevis] = useState({
    reference:'',
    objet:'', 
    client:'', 
    adresse:'', 
    pays:'', 
    code:'', 
    designation:'', 
    quantiter:'',
    prix_unitaire:'',
    montant:'', 
    unite:'',
    date:'',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [devisPerPage] = useState(5);

  // State for unique options
  const [uniqueReference, setUniqueReference] = useState([]);
  const [uniqueClient, setUniqueClient] = useState([]);
  const [uniqueDesignation, setUniqueDesignation] = useState([]);
  const [uniqueDate, setUniqueDate] = useState([]);

  useEffect(() => {
    fetchDevis();
    fetchContacts();
  }, []);

  useEffect(() => {
    applyFilters();
    generateUniqueOptions(); // Generate unique options when offres change
  }, [devis, filters]);
  

  const fetchDevis = async () => {
    try {
      const response = await axios.get('/Devis');
      setDevis(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des offres:", error);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await axios.get('/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des contacts:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Réinitialiser à la première page
};

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };
  
  const filteredDevisOffre = devis.filter(devisOffres => {
    const matchesFilters =
        (filters.reference === '' || devisOffres.reference === filters.reference) &&
        (filters.client === '' || devisOffres.entreprise === filters.client) &&
        (filters.designation === '' || devisOffres.designation >= filters.designation) &&
        (filters.date === '' || devisOffres.date <= filters.date);

    const matchesSearchQuery =
        devisOffres.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        devisOffres.objet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        devisOffres.entreprise.toLowerCase().includes(searchQuery.toLowerCase()) ||
        devisOffres.adresse.toLowerCase().includes(searchQuery.toLowerCase()) ||
        devisOffres.pays.toLowerCase().includes(searchQuery.toLowerCase()) ||
        devisOffres.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        devisOffres.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        devisOffres.quantiter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        devisOffres.prix_unitaire.toLowerCase().includes(searchQuery.toLowerCase()) ||
        devisOffres.montant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        devisOffres.unite.toLowerCase().includes(searchQuery.toLowerCase()) ||
        devisOffres.date.toLowerCase().includes(searchQuery.toLowerCase());


    return matchesFilters && matchesSearchQuery;
});

  const applyFilters = () => {
    let result = devis;
    if (filters.reference) {
        result = result.filter(devisOffres => devisOffres.reference === filters.reference);
    }
    if (filters.client) {
        result = result.filter(devisOffres => devisOffres.entreprise === filters.client);
    }
    if (filters.designation) {
        result = result.filter(devisOffres => devisOffres.designation >= filters.designation);
    }
    if (filters.date) {
        result = result.filter(devisOffres => devisOffres.date <= filters.date);
    }
    setFilteredDevis(result);
};

  const handleResetFilters = () => {
    setFilters({
      reference:'',
      client:'', 
      designation:'', 
      date:'',
    });
  };

  const handleShow = (mode, devis = null) => {
    setModalMode(mode);
    if (mode === 'edit' && devis) {
      setNewDevis(devis);
    } else {
      setNewDevis({
        reference:'',
        objet:'', 
        client:'', 
        adresse:'', 
        pays:'', 
        code:'', 
        designation:'', 
        quantiter:'',
        prix_unitaire:'',
        montant:'', 
        unite:'',
        date:'',
      });
    }
    setShowModal(true);
    setModalPage(1);
  };

  const handleClose = () => setShowModal(false);
  const handleCloseConfirmModal = () => setShowConfirmModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDevis({
      ...newDevis,
      [name]: value
    });
  };

  // ajouter le donner au table devis
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await axios.post('/Devis', newDevis);
        setAlert({ show: true, message: 'Devis ajouté avec succès.', variant: 'success' });
      } else {
        await axios.put(`/Devis/${newDevis.id}`, newDevis);
        setAlert({ show: true, message: 'Contact mis à jour avec succès.', variant: 'success' });
      }
      fetchDevis();
      handleClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout/modification de devi:", error);
      setAlert({ show: true, message: `Échec de l'opération: ${modalMode === 'add' ? 'ajout' : 'mise à jour'} du devis.`, variant: 'danger' });
    }
  };

  //modifier le donner au table devis
  const editDevis = (devisOffres) => {
    setSelectedDevis(devisOffres);
    setNewDevis({
      reference: devisOffres.reference,
      objet: devisOffres.objet,
      client: devisOffres.client,
      adresse: devisOffres.adresse,
      pays: devisOffres.pays,
      code: devisOffres.code,
      designation: devisOffres.designation,
      quantiter: devisOffres.quantiter,
      prix_unitaire: devisOffres.prix_unitaire,
      montant: devisOffres.montant,
      unite: devisOffres.unite,
      date: devisOffres.date,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/Devis/${setSelectedDevis.id}`, newDevis);
      fetchDevis();
      setAlert({ show: true, message: 'Devis mis à jour avec succès.', variant: 'success' });
      handleClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du devis:", error);
      setAlert({ show: true, message: "Échec de la mise à jour du devis.", variant: 'danger' });
    }
  };

  // Fonction pour ouvrir la boîte de confirmation avant suppression
  const confirmDelete = (devisOffres) => {
    setDevisToDelete(devisOffres);
    setShowConfirmModal(true); // Afficher la boîte de confirmation
  };

  const deleteDevis = async () => {
    try {
      await axios.delete(`/Devis/${devisToDelete.id}`);
      fetchDevis();  // Rafraîchir la liste des contacts après suppression
      setShowConfirmModal(false); // Fermer la boîte de confirmation
    } catch (error) {
      console.error("Erreur lors de la suppression du contact:", error);
    }
  };
  const indexOfLastDevis = currentPage * devisPerPage;
  const indexOfFirstDevis = indexOfLastDevis - devisPerPage;
  const currentDevis = filteredDevisOffre.slice(indexOfFirstDevis, indexOfLastDevis);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const generateUniqueOptions = () => {
    const reference = [...new Set(devis.map(devisOffres => devisOffres.reference))];
    const client = [...new Set(devis.map(devisOffres => devisOffres.entreprise))];
    const designation = [...new Set(devis.map(devisOffres => devisOffres.designation))];
    const date = [...new Set(devis.map(devisOffres => devisOffres.date))];

    setUniqueReference(reference);
    setUniqueClient(client);
    setUniqueDesignation(designation);
    setUniqueDate(date);
  };

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
          <Link to='/GestionOffre' className="btn  btn-outline-secondary  text-dark">
            <i className="bi bi-cart3"> Presentation des offres</i>
          </Link>{' '}
          <Link to='/GestionDeDevis' className='ms-2 btn  btn-outline-secondary  text-dark'>
            <i className="bi bi-cash-coin"> Gestion des devis</i>
          </Link>{' '}
          <Link to='/GererOffre' className='ms-2 btn  btn-outline-secondary  text-dark'>
            <i className="bi bi-cart3"> Gestion des offres</i>
          </Link>
        </div>
      </div>
      <div className="card mb-4 mt-4">
        <div className="card-header text-white" style={{ background: '#72A0C1'}}>
          <h5>Gestion des devis</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="client" className="form-label">Reference</label>
              <select
                id="reference"
                name="reference"
                className="form-select"
                value={filters.reference}
                onChange={handleFilterChange}
              >
                <option value="">Veuillez choisir le reference</option>
                {uniqueReference.map((reference, index) => (
                  <option key={index} value={reference}>{reference}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="client" className="form-label">Client</label>
              <select
                id="client"
                name="client"
                className="form-select"
                value={filters.client}
                onChange={handleFilterChange}
              >
                <option value="">Veuillez choisir le client</option>
                {uniqueClient.map((client, index) => (
                  <option key={index} value={client}>{client}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="designation" className="form-label">Designation</label>
              <select
                id="designation"
                name="designation"
                className="form-select"
                value={filters.designation}
                onChange={handleFilterChange}
              >
                <option value="">Veuillez choisir la designation</option>
                {uniqueDesignation.map((designation, index) => (
                  <option key={index} value={designation}>{designation}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="date" className="form-label">Date de devis</label>
              <select
                id="date"
                name="date"
                className="form-select"
                value={filters.date}
                onChange={handleFilterChange}
              >
                <option value="">Veuillez choisir la date de devis</option>
                {uniqueDate.map((date, index) => (
                  <option key={index} value={date}>{date}</option>
                ))}
              </select>
            </div>
          </div>
            <div className="col-md-6 d-flex align-items-end mt-3">
                <button className="btn btn-transparent text-light me-2" style={{ background: '#72A0C1'}}>Appliquer les filtres</button>
                <button className="btn btn-secondary" onClick={handleResetFilters}>
                  Réinitialiser filtres
                </button>
            </div>
        </div>
      </div>

      {/* Offre Table */}
    <div className="liste card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between mb-2">
          <button className="btn btn-info" onClick={() => handleShow('add')}>+ Nouveau devis</button>
            <div className='d-flex justify-content-between'>
            <input type="text" className="form-control w-75 sm-2" placeholder="Rechercher" value={searchQuery} onChange={handleSearchChange} /> 
            
          </div>
        </div>
      <div className="table-responsive mt-4">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Objet</th>
              <th>Client</th>
              <th>Adresse</th>
              <th>Pays</th>
              <th>Code</th>
              <th>Designation</th>
              <th>Quantiter</th>
              <th>Prix unitaire</th>
              <th>Montant</th>
              <th>Uniter</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentDevis.map(devisOffres => (
              <tr key={devisOffres.id}>
                <td>{devisOffres.reference}</td>
                <td>{devisOffres.objet}</td>
                <td>{devisOffres.entreprise}</td>
                <td>{devisOffres.adresse}</td>
                <td>{devisOffres.pays}</td>
                <td>{devisOffres.code}</td>
                <td>{devisOffres.designation}</td>
                <td>{devisOffres.quantiter}</td>
                <td>{devisOffres.prix_unitaire}</td>
                <td>{devisOffres.montant}</td>
                <td>{devisOffres.unite}</td>
                <td>{devisOffres.date}</td>
                <td className='d-flex justify-content-between'>
                <Button variant="outline-success" size="sm" onClick={() => generatePDF(devisOffres)} >
                <i class="bi bi-filetype-pdf"></i>
                </Button>
                  <Button variant="outline-primary" size="sm" onClick={() => handleShow('edit', devisOffres)}>
                  <FaPenAlt />
                  </Button>
                  <Button variant="outline-danger" size="sm"  onClick={() => confirmDelete(devisOffres)}>
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
            {Array.from({ length: Math.ceil(filteredDevis.length / devisPerPage) }, (_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                <button onClick={() => paginate(i + 1)} className="page-link">{i + 1}</button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      </div>

      {/* Modal for adding/editing offers */}
      <Modal show={showModal} onHide={handleClose} size="xl" aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Header closeButton style={{background:'#72A0C1'}} className='text-light'>
            <Modal.Title>{modalMode === 'add' ? 'Ajout Devis' : 'Modifier Devis'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
            <div className="row py-4 px-3">
                <div className="col-md-4">
                  <Form.Group controlId="reference">
                    <Form.Label>Reference</Form.Label>
                    <Form.Control
                      type="text"
                      name="reference"
                      value={newDevis.reference}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  </div>
                  <div className="col-md-4">
                  <Form.Group controlId="objet">
                    <Form.Label>Objet</Form.Label>
                    <Form.Control
                      type="text"
                      name="objet"
                      value={newDevis.objet}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  </div>
                  <div className="col-md-4">
                   <Form.Group controlId="client">
                    <Form.Label>Client</Form.Label>
                    <Form.Select
                      id="contactSelect"
                      name='client'
                      className="form-select"
                      value={newDevis.client}
                      onChange={handleInputChange}
                    >
                      <option value="">-- Sélectionnez le client --</option>
                      {contacts.map((contact) => (
                        <option key={contact.id} value={contact.id}>
                          {contact.entreprise}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  </div>
                  <div className="col-md-4">
                  <Form.Group controlId="adresse">
                    <Form.Label>Adresse</Form.Label>
                    <Form.Control
                      type="text"
                      name="adresse"
                      value={newDevis.adresse}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  </div>
                  <div className="col-md-4">
                  <Form.Group controlId="pays">
                    <Form.Label>Pays</Form.Label>
                    <Form.Control
                      type="text"
                      name="pays"
                      value={newDevis.pays}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  </div>
                  <div className="col-md-4">
                  <Form.Group controlId="code">
                    <Form.Label>Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="code"
                      value={newDevis.code}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  </div>
                  <div className="col-md-4">
                  <Form.Group controlId="designation">
                    <Form.Label>Designation</Form.Label>
                    <Form.Control
                      type="text"
                      name="designation"
                      value={newDevis.designation}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  </div>
                  <div className="col-md-4">
                  <Form.Group controlId="quantiter">
                    <Form.Label>Quantiter</Form.Label>
                    <Form.Control
                      type="number"
                      name="quantiter"
                      value={newDevis.quantiter}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  </div>
                  <div className="col-md-4">
                  <Form.Group controlId="prix_unitaire">
                    <Form.Label>Prix unitaire</Form.Label>
                    <Form.Control
                      type="number"
                      name="prix_unitaire"
                      value={newDevis.prix_unitaire}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  </div>
                  <div className="col-md-4">
                  <Form.Group controlId="montant">
                    <Form.Label>Montant</Form.Label>
                    <Form.Control
                      type="number"
                      name="montant"
                      value={newDevis.montant}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  </div>
                  <div className="col-md-4">
                  <Form.Group controlId="unite">
                  <Form.Label>Uniter</Form.Label>
                  <Form.Select
                    name="unite"
                    value={newDevis.unite}
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
                  <div className="col-md-4">
                  <Form.Group controlId="date">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={newDevis.date}
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
          Êtes-vous sûr de vouloir supprimer le devis "{devisToDelete?.reference}" ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmModal}>
            Annuler
          </Button>
          <Button variant="danger" onClick={deleteDevis}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    </div>
  );
};

export default Devis;
