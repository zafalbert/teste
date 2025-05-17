import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPhone, FaTrashAlt, FaPenAlt } from 'react-icons/fa';
import { Modal, Button, Form, Alert,  Pagination } from 'react-bootstrap';
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


export default function Employer({ onNewTaskAdded }) {
  const [employers, setEmployer] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployer, setFilteredEmployer] = useState([]);
  const itemsPerPage = 4; 
  const [modalMode, setModalMode] = useState('add'); // 'add' ou 'edit'

  const [editMode, setEditMode] = useState(false); // pour basculer entre ajout et modification
  const [selectedEmployer, setSelectedEmployer] = useState(null); // pour stocker le contact sélectionné
  const [showModal, setShowModal] = useState(false); // State to show/hide the modal for adding/editing
  const [showConfirmModal, setShowConfirmModal] = useState(false); // State to show/hide the confirmation modal
  const [employerToDelete, setEmployerToDelete] = useState(null); // Store contact for deletion
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [modalPage, setModalPage] = useState(1);
  const [newEmployer, setNewEmployer] = useState({
    nom: '',
    prenom: '',
    email: '',
    fonction:'', 
    adresse:'', 
    date_prise_poste:'',
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Réinitialiser à la première page
};


  useEffect(() => {
    const filteredEmployer = employers.filter(employer => {
      const matchesSearchQuery =
        employer.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employer.prenom.toString().toLowerCase().includes(searchQuery.toLowerCase()) || // Convertir prix en string
        employer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employer.fonction.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employer.adresse.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employer.date_prise_poste.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearchQuery;
    });

    setFilteredEmployer(filteredEmployer);
  }, [employers, searchQuery]);
  
  // Calculate the items to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployers = filteredEmployer.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(employers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fonction pour récupérer les contacts
  const fetchEmployer = async () => {
    try {
      const response = await axios.get('/Employer');
      setEmployer(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des contacts:", error);
    }
  };

  useEffect(() => {
    fetchEmployer();
  }, []);

  // Ouvrir/fermer la modale
  const handleShow = (mode, employer = null) => {
    setModalMode(mode);
    if (mode === 'edit' && employer) {
      setNewEmployer({ ...employer });
    } else {
      setNewEmployer({
        nom: '',
        prenom: '',
        email: '',
        fonction:'', 
        adresse:'', 
        date_prise_poste:'',
      });
    }
    setShowModal(true);
    setModalPage(1);
  };

  const handleClose = () => setShowModal(false);

  const handleCloseConfirmModal = () => setShowConfirmModal(false);

  // Gérer les changements dans les champs de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployer({
      ...newEmployer,
      [name]: value
    });
  };

  // Gérer le passage d'une page à l'autre dans la modale
  const handleNextPage = () => {
    setModalPage(modalPage + 1);
  };

  const handlePreviousPage = () => {
    setModalPage(modalPage - 1);
  };

  // Soumettre le nouveau contact
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await axios.post('/Employer', newEmployer);
        setAlert({ show: true, message: 'Employer ajouté avec succès.', variant: 'success' });
      } else {
        await axios.put(`/Employer/${newEmployer.id}`, newEmployer);
        setAlert({ show: true, message: 'Employer mis à jour avec succès.', variant: 'success' });
      }
      fetchEmployer();
      handleClose();
    } catch (error) {
      console.error("Erreur lors de l'opération:", error);
      setAlert({ show: true, message: `Échec de l'opération: ${modalMode === 'add' ? 'ajout' : 'mise à jour'} d'Employer.`, variant: 'danger' });
    }
  };

  const editEmployer = (employer) => {
    setSelectedEmployer(employer);
    setNewEmployer({
      nom: employer.nom,
      prenom: employer.prenom,
      email: employer.email,
      fonction: employer.fonction,
      adresse: employer.adresse,
      date_prise_poste: employer.date_prise_poste,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/Employer/${setSelectedEmployer.id}`, newEmployer);
      fetchEmployer();
      setAlert({ show: true, message: 'Employer mis à jour avec succès.', variant: 'success' });
      handleClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour d'employer:", error);
      setAlert({ show: true, message: "Échec de la mise à jour d'employer.", variant: 'danger' });
    }
  };

  // Fonction pour ouvrir la boîte de confirmation avant suppression
  const confirmDelete = (employer) => {
    setEmployerToDelete(employer);
    setShowConfirmModal(true); // Afficher la boîte de confirmation
  };

  // Fonction pour supprimer un contact après confirmation
  const deleteEmployer = async () => {
    try {
      await axios.delete(`/Employer/${employerToDelete.id}`);
      fetchEmployer();  // Rafraîchir la liste des contacts après suppression
      setShowConfirmModal(false); // Fermer la boîte de confirmation
    } catch (error) {
      console.error("Erreur lors de la suppression d'employer:", error);
    }
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

      {/* Gestion des contacts - Filtres */}
      <div className="card mb-4 mt-5">
        <div className="card-header text-white" style={{ background: '#72A0C1'}}>
          <h5>Gestion des employées</h5>
        </div>
      </div>

      {/* Liste des contacts */}
      <div className="liste card mb-4">
  <div className="card-body">
    <div className="d-flex justify-content-between mb-3">
      <button className="btn btn-info" onClick={() => handleShow('add')}>+ Nouveau information</button>
      <input type="text" className="form-control w-25" placeholder="Rechercher"  value={searchQuery} onChange={handleSearchChange} />
    </div>
    <div className="table-responsive">  {/* Ajouté : Conteneur avec gestion du débordement */}
      <table className="table table-striped contact-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Fonction</th>
            <th>Adresse</th>
            <th>Dete prise du poste</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
                {currentEmployers.length > 0 ? (
                  currentEmployers.map(employer => (
                    <tr key={employer.id}>
                      <td>{employer.nom}</td>
                      <td>{employer.prenom}</td>
                      <td>{employer.email}</td>
                      <td>{employer.fonction}</td>
                      <td>{employer.adresse}</td>
                      <td>{employer.date_prise_poste}</td>
                      <td className="d-flex ms-2" style={{ fontSize: '5px' }}>
                        <button className="btn btn-sm btn-outline-primary ms-1" onClick={() => handleShow('edit', employer)}>
                          <FaPenAlt />
                        </button>
                        <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => confirmDelete(employer)}>
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">Aucun contact trouvé.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination controls */}
          <Pagination className="justify-content-center">
            {Array.from({ length: totalPages }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      </div>
      <Modal show={showModal} onHide={handleClose}  size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton >
          <Modal.Title>{modalMode === 'add' ? 'Ajout employer' : 'Modifier employer'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
          <div className="row py-4 px-3">
              <div className="col-md-6">
                <Form.Group controlId="firstName">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    type="text"
                    name="nom"
                    value={newEmployer.nom}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="prenom">
                  <Form.Label>Prenom</Form.Label>
                  <Form.Control
                    type="text"
                    name="prenom"
                    value={newEmployer.prenom}
                    onChange={handleInputChange}
                    required
                  />
                  </Form.Group>
              </div>
              <div className="col-md-6">
                  <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={newEmployer.email}
                    onChange={handleInputChange}
                    required
                  />
                  </Form.Group>
              </div>
              <div className="col-md-6">            
                <Form.Group controlId="fonction">
                  <Form.Label>Fonction</Form.Label>
                  <Form.Control
                    type="text"
                    name="fonction"
                    value={newEmployer.fonction}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="adresse">
                <Form.Label>Adresse</Form.Label>
                  <Form.Control
                    type="text"
                    name="adresse"
                    value={newEmployer.adresse}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="date_prise_poste">
                <Form.Label>Date prise de poste</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_prise_poste"
                    value={newEmployer.date_prise_poste}
                    onChange={handleInputChange}
                    required
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

       {/* Modale de confirmation avant suppression */}
       <Modal show={showConfirmModal} onHide={handleCloseConfirmModal} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton style={{ background: '#72A0C1'}}>
          <Modal.Title>Confirmation de suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer {employerToDelete?.nom} {employerToDelete?.prenom} ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmModal}>
            Annuler
          </Button>
          <Button variant="danger" onClick={deleteEmployer}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}
