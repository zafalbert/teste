import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPhone, FaTrashAlt, FaPenAlt } from 'react-icons/fa';
import { Modal, Button, Form, Alert, Fade } from 'react-bootstrap';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
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


export default function Contact({ onNewTaskAdded }) {
  const [value, setValue] = useState()
  const [contacts, setContacts] = useState([]);
  const [filters, setFilters] = useState({
    typologie: '',
    entreprise: ''
  });

  const [modalMode, setModalMode] = useState('add'); // 'add' ou 'edit'
  const [searchQuery, setSearchQuery] = useState('');
  const [editMode, setEditMode] = useState(false); // pour basculer entre ajout et modification
  const [selectedContact, setSelectedContact] = useState(null); // pour stocker le contact sélectionné
  const [showModal, setShowModal] = useState(false); // State to show/hide the modal for adding/editing
  const [modalTransition, setModalTransition] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // State to show/hide the confirmation modal
  const [contactToDelete, setContactToDelete] = useState(null); // Store contact for deletion
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [modalPage, setModalPage] = useState(1);
  const [newContact, setNewContact] = useState({
    nom: '',
    prenom: '',
    email: '',
    business_email: '',
    phone: '',
    code_ape: '',
    typologie: '',
    entreprise: '',
    office: ''
  });

  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(5); // Nombre de contacts par page*

  // recherche dynamique
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Réinitialiser à la première page
  };
  
 // Fonction pour obtenir le CSRF token
 


  // Fonction pour récupérer les contacts
  const fetchContacts = async () => {
    try {
      const response = await axios.get('/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des contacts:", error);
      setAlert({ 
        show: true, 
        message: "Erreur lors de la récupération des contacts", 
        variant: 'danger' 
      });
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Gérer le changement des filtres
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setFilters({
      typologie: '',
      entreprise: ''
    });
  };

  // Filtrer les contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesFilters = 
      (filters.typologie === '' || contact.typologie === filters.typologie) &&
      (filters.entreprise === '' || contact.entreprise === filters.entreprise);
    
    const matchesSearchQuery = 
      contact.nom.toLowerCase().includes(searchQuery.toLowerCase()) || 
      contact.prenom.toLowerCase().includes(searchQuery.toLowerCase()) || 
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.business_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.code_ape.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.typologie.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.entreprise.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.office.toLowerCase().includes(searchQuery.toLowerCase()) ;
  
  
    return matchesFilters && matchesSearchQuery;
  });

  // Obtenir les valeurs uniques pour les listes déroulantes
  const uniqueTypologies = [...new Set(contacts.map(contact => contact.typologie))];
  const uniqueEntreprises = [...new Set(contacts.map(contact => contact.entreprise))];

  // Pagination logic
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Ouvrir/fermer la modale
  const handleShow = (mode, contact = null) => {
    setModalMode(mode);
    if (mode === 'edit' && contact) {
      setNewContact({ ...contact });
    } else {
      setNewContact({
        nom: '', prenom: '', email: '', business_email: '', 
        phone: '', code_ape: '', typologie: '', 
        entreprise: '', office: ''
      });
    }
    setShowModal(true);
    // Ajoutez un petit délai pour l'animation
    setTimeout(() => setModalTransition(true), 50);
    setModalPage(1);
  };

  const handleClose = () => {
    setModalTransition(false);
    // Délai pour permettre l'animation de fermeture
    setTimeout(() => setShowModal(false), 300);
  };

  const handleCloseConfirmModal = () => setShowConfirmModal(false);

  // Gérer les changements dans les champs de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact({
      ...newContact,
      [name]: value
    });
  };

  // Soumettre le nouveau contact
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await axios.post('/contacts', newContact);
        setAlert({ show: true, message: 'Contact ajouté avec succès.', variant: 'success' });
      } else {
        await axios.put(`/contacts/${newContact.id}`, newContact);
        setAlert({ show: true, message: 'Contact mis à jour avec succès.', variant: 'success' });
      }
      
      fetchContacts();
      handleClose();
    } catch (error) {
      console.error("Erreur lors de l'opération:", error);
      setAlert({ show: true, message: `Échec de l'opération: ${modalMode === 'add' ? 'ajout' : 'mise à jour'} du contact.`, variant: 'danger' });
    }
  };


  const editContact = (contact) => {
    setSelectedContact(contact);
    setNewContact({
      nom: contact.nom,
      prenom: contact.prenom,
      email: contact.email,
      business_email: contact.business_email,
      phone: contact.phone,
      code_ape: contact.code_ape,
      typologie: contact.typologie,
      entreprise: contact.entreprise,
      office: contact.office
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/contacts/${selectedContact.id}`, newContact);
      fetchContacts();
      setAlert({ show: true, message: 'Contact mis à jour avec succès.', variant: 'success' });
      handleClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du contact:", error);
      setAlert({ show: true, message: "Échec de la mise à jour du contact.", variant: 'danger' });
    }
};

  // Fonction pour ouvrir la boîte de confirmation avant suppression
  const confirmDelete = (contact) => {
    setContactToDelete(contact);
    setShowConfirmModal(true); // Affiche le modal
    setTimeout(() => setModalTransition(true), 50);
    setModalPage(1);
  };
  

  // Fonction pour supprimer un contact après confirmation
  const deleteContact = async () => {
    try {
      await axios.delete(`/contacts/${contactToDelete.id}`);
      fetchContacts();  // Rafraîchir la liste des contacts après suppression
      setShowConfirmModal(false); // Fermer la boîte de confirmation
    } catch (error) {
      console.error("Erreur lors de la suppression du contact:", error);
      setAlert({ 
        show: true, 
        message: "Erreur lors de la suppression du contact", 
        variant: 'danger' 
      });
    }
  };


  const handleWhatsappClick = (contact) => {
    let { phone } = contact;

    // Retirer le "+" pour créer le format attendu par l'API
    if (phone.startsWith('+')) {
        phone = phone.slice(1);
    }

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}`;
    window.open(whatsappUrl, '_blank');
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
          <h5>Gestion des contacts</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <label htmlFor="typologie" className="form-label">Typologie</label>
              <select
                id="typologie"
                name="typologie"
                className="form-select"
                value={filters.typologie}
                onChange={handleFilterChange}
              >
                <option value="">Toutes les typologies</option>
                {uniqueTypologies.map((typologie, index) => (
                  <option key={index} value={typologie}>{typologie}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="entreprise" className="form-label">Entreprise</label>
              <select
                id="entreprise"
                name="entreprise"
                className="form-select"
                value={filters.entreprise}
                onChange={handleFilterChange}
              >
                <option value="">Toutes les entreprises</option>
                {uniqueEntreprises.map((entreprise, index) => (
                  <option key={index} value={entreprise}>{entreprise}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button className="btn btn-transparent text-light me-2" style={{ background: '#72A0C1'}}>Appliquer les filtres</button>
              <button className="btn btn-secondary" onClick={handleResetFilters}>Réinitialiser filtres</button>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des contacts */}
      <div className="liste card mb-4">
  <div className="card-body">
    <div className="d-flex justify-content-between mb-3">
      <button className="btn btn-info" onClick={() => handleShow('add')}>+ Nouveau client</button>
      <input type="text" className="form-control w-25" placeholder="Rechercher" value={searchQuery} onChange={handleSearchChange}/>
    </div>
    <div className="table-responsive">  {/* Ajouté : Conteneur avec gestion du débordement */}
      <table className="table table-striped contact-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Business email</th>
            <th>Téléphone</th>
            <th>Code APE</th>
            <th>Typologie</th>
            <th>Entreprise</th>
            <th>Office</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentContacts.length > 0 ? (
            currentContacts.map(contact => (
              <tr key={contact.id}>
                <td>{contact.nom}</td>
                <td>{contact.prenom}</td>
                <td>{contact.email}</td>
                <td>{contact.business_email}</td>
                <td>{contact.phone}</td>
                <td>{contact.code_ape}</td>
                <td>{contact.typologie}</td>
                <td>{contact.entreprise}</td>
                <td>{contact.office}</td>
                <td className="d-flex justify-content-between" style={{fontSize:'5px'}}>
                    <button className="btn btn-sm btn-outline-success" onClick={() => handleWhatsappClick(contact)}>
                      <FaPhone />
                    </button>
                  <button className="btn btn-sm btn-outline-primary ms-0.5" onClick={() => handleShow('edit', contact)}>
                    <FaPenAlt />
                  </button>
                  <button className="btn btn-sm btn-outline-danger ms-0.5" onClick={() => confirmDelete(contact)}>
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center">Aucun contact trouvé.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div> {/* Fin du conteneur table-responsive */}
    
    {/* Pagination */}
          <nav>
            <ul className="pagination justify-content-center">
              {Array.from({ length: Math.ceil(filteredContacts.length / contactsPerPage) }, (_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => paginate(index + 1)}>
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <Modal 
  show={showModal} 
  onHide={handleClose} 
  size="xl" 
  aria-labelledby="contained-modal-title-vcenter" 
  centered
  animation={true}
  dialogClassName={`modal-dialog-slide ${modalTransition ? 'show' : ''}`}
>
  <Modal.Header closeButton style={{background:'#72A0C1'}}>
    <Modal.Title >{modalMode === 'add' ? 'Ajout Contact' : 'Modifier Contact'}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form onSubmit={handleSubmit}>
      <div className="row py-3 px-3">
        <div className="col-md-4">
          <Form.Group controlId="firstName">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type="text"
              name="nom"
              value={newContact.nom}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group controlId="prenom">
            <Form.Label>Prénom</Form.Label>
            <Form.Control
              type="text"
              name="prenom"
              value={newContact.prenom}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={newContact.email}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </div>
      </div>

      <div className="row py-3 px-3">
        <div className="col-md-4">
          <Form.Group controlId="business_email">
            <Form.Label>Email business</Form.Label>
            <Form.Control
              type="email"
              name="business_email"
              value={newContact.business_email}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group controlId="office">
            <Form.Label>Office</Form.Label>
            <Form.Control
              type="text"
              name="office"
              value={newContact.office}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </div>
        
        <div className="col-md-4">
          <Form.Group controlId="code_ape">
            <Form.Label>Code APE</Form.Label>
            <Form.Control
              type="text"
              name="code_ape"
              value={newContact.code_ape}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group controlId="typologie">
            <Form.Label>Typologie</Form.Label>
            <Form.Control
              type="text"
              name="typologie"
              value={newContact.typologie}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group controlId="entreprise">
            <Form.Label>Entreprise</Form.Label>
            <Form.Control
              type="text"
              name="entreprise"
              value={newContact.entreprise}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group controlId="phone">
            <Form.Label>Phone</Form.Label>
            <PhoneInput
              placeholder="Enter phone number"
              value={newContact.phone}
              onChange={(phone) => setNewContact({ ...newContact, phone })}
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
       <Modal show={showConfirmModal} 
      onHide={handleCloseConfirmModal} 
      aria-labelledby="contained-modal-title-center" 
      centered
      animation={true}
      dialogClassName={`modal-dialog-slide ${modalTransition ? 'show' : ''}`}
    >
        <Modal.Header closeButton style={{ background: '#72A0C1'}}>
          <Modal.Title>Confirmation de suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer {contactToDelete?.nom} {contactToDelete?.prenom} ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmModal}>
            Annuler
          </Button>
          <Button variant="danger" onClick={deleteContact}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}
