import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTrashAlt, FaPenAlt } from 'react-icons/fa';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useNotifications } from './NotificationContext';
import './Contact.css';
import './Tache.css';

const alertStyle = {
  position: 'fixed',
  top: '6.8rem',
  right: '20px',
  width: '300px',
  zIndex: 9999,
  padding: '-2px',
  height: '2vh',
};



export default function Tache({ onNewTaskAdded }) {
  const { newTasks, setNewTasks } = useNotifications();
  const [taches, setTaches] = useState([]);
  const [filters, setFilters] = useState({
    etat: '',
    Intervenant: '',
    date_prevus: '',
    date_de_realisation: '',
    
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [employers, setEmployer] = useState([]);
  const [tachesEnRetard, setTachesEnRetard] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false); // pour contrôler l'affichage du formulaire contact
  const [contact, setContacts] = useState([]); // Pour stocker les personnes
  const [selectedContact, setSelectedContact] = useState(''); // Pour stocker la personne sélectionnée
  const [modalMode, setModalMode] = useState('add');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [tacheToDelete, setTacheToDelete] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [modalPage, setModalPage] = useState(1);
  const [newTache, setNewTache] = useState({
    etat: '',
    intitule: '',
    Intervenant: '',
    date_prevus: '',
    date_de_realisation: '',
    commentaire: '',
    lien_angenda: '',
    numero_contact: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [tachesPerPage] = useState(5);

  const fetchTaches = async () => {
    try {
      const response = await axios.get('/Taches');
      const today = new Date();

      const tachesEnRetard = response.data.filter(tache => {
        const datePrevus = new Date(tache.date_prevus);
        return datePrevus < today && tache.etat !== 'Terminé';
      });

      setTaches(response.data);
      setTachesEnRetard(tachesEnRetard.length); // Stockez le nombre de tâches en retard
  
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      setAlert({ show: true, message: "Erreur lors de la récupération des tâches.", variant: 'danger' });
    }
  };

  useEffect(() => {
    fetchTaches();
    const fetchContacts = async () => {
      try {
        const response = await axios.get('/contacts'); // Remplacez par votre URL d'API
        setContacts(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des personnes:', error);
      }
    };
    const fetchEmployer = async () => {
      try {
        const response = await axios.get('/Employer');
        setEmployer(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des contacts:", error);
      }
    };
    fetchContacts();
    fetchEmployer();
  }, []);

  useEffect(() => {
    fetchTaches();
    const interval = setInterval(fetchTaches, 3600000); // Relance toutes les heures (3600000ms = 1 heure)
  
    return () => clearInterval(interval); // Nettoyage à la fin du cycle de vie du composant
  }, []);

  // Gestion de la sélection d'une personne
  const handleSelectChange = (e) => {
    setSelectedContact(e.target.value);
    console.log(`Numero contact sélectionné: ${e.target.value}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleResetFilters = () => {
    setFilters({
      etat: '',
      Intervenant: '',
      date_prevus: '',
      date_de_realisation: '',
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const filteredTaches = taches.filter((tache) => {
    const matchesFilters = (
      (filters.etat === '' || tache.etat === filters.etat) &&
      (filters.Intervenant === '' || tache.nom === filters.Intervenant) &&
      (filters.date_prevus === '' || tache.date_prevus === filters.date_prevus) &&
      (filters.date_de_realisation === '' || tache.date_de_realisation === filters.date_de_realisation)
    );

    const searchableFields = [
      tache.etat,
      tache.intitule,
      tache.nom,
      tache.commentaire,
      tache.numero_contact
    ].map(field => (field || '').toString().toLowerCase());

    const matchesSearch = searchTerm === '' || searchableFields.some(field => 
      field.includes(searchTerm.toLowerCase())
    );

    return matchesFilters && matchesSearch;
  });

  const uniqueEtat = [...new Set(taches.map((tache) => tache.etat))];
  const uniqueIntervenant = [...new Set(taches.map((tache) => tache.nom))];
  const uniqueDatePrevus = [...new Set(taches.map((tache) => tache.date_prevus))];
  const uniqueDateDeRealisation = [...new Set(taches.map((tache) => tache.date_de_realisation))];

  const indexOfLastTache = currentPage * tachesPerPage;
  const indexOfFirstTache = indexOfLastTache - tachesPerPage;
  const currentTaches = filteredTaches.slice(indexOfFirstTache, indexOfLastTache);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleShow = (mode, tache = null) => {
    setModalMode(mode);
    if (mode === 'edit' && tache) {
        setNewTache({ ...tache }); // Copie de l'objet tache pour édition
    } else {
        setNewTache({ // Réinitialisation pour l'ajout
            etat: '',
            intitule: '',
            Intervenant: '',
            date_prevus: '',
            date_de_realisation: '',
            commentaire: '',
            lien_angenda: '',
            numero_contact: '',
        });
    }
    setShowModal(true);
    setModalPage(1);
};

  const handleClose = () => setShowModal(false);

  const handleCloseConfirmModal = () => setShowConfirmModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTache({
      ...newTache,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isChecked = !!newTache.Intervenant; 
  
      if (modalMode === 'add') {
        const taskToSubmit = {
          ...newTache,
          Intervenant: isChecked ? newTache.Intervenant : 'Tâche non effectuée',
          etat: isChecked ? 'En cours' : 'À faire',
        };
  
        const response = await axios.post('/Taches', taskToSubmit);
        setAlert({ show: true, message: 'Tâche ajoutée avec succès.', variant: 'success' });
        
        // Mettre à jour les nouvelles tâches
        if (newTasks) {
          const addedTask = response.data;
          setNewTasks([...newTasks, addedTask]);
        }
        
        // Notifier le parent si nécessaire
        if (onNewTaskAdded) {
          onNewTaskAdded(response.data);
        }
      } else {

        if (newTache.etat === 'Réalisé') {
          newTache.date_de_realisation = newTache.date_de_realisation || new Date().toISOString().split('T')[0];
        }
        const updatedTache = { ...newTache, etat: newTache.etat || 'En cours' }; 
        await axios.put(`/Taches/${updatedTache.id}`, updatedTache);        
        
      }
      fetchTaches();
      setShowModal(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout/modification de la tâche:", error);
      let errorMessage = "Une erreur est survenue lors de l'ajout/modification de la tâche.";
      if (error.response) {
        errorMessage += ` (${error.response.status}: ${error.response.data.message || 'Erreur inconnue'})`;
      }
      setAlert({ show: true, message: errorMessage, variant: 'danger' });
    }
  };

  const handleDelete = (tache) => {
    setTacheToDelete(tache);
    setShowConfirmModal(true);
  };

  const deleteTache = async () => {
    try {
      await axios.delete(`/Taches/${tacheToDelete.id}`);
      setAlert({ show: true, message: 'Tâche supprimée avec succès.', variant: 'success' });
      fetchTaches();
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      setAlert({ show: true, message: 'Erreur lors de la suppression de la tâche.', variant: 'danger' });
    }
    setShowConfirmModal(false);
  };

  return (
  <div className="contact-container container">
        {alert.show && (
          <div style={alertStyle}>
            <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
              {alert.message}
            </Alert>
          </div>
        )}
      
        <div className="card mb-4 mt-4">
          <div className="card-header text-white"  style={{ background: '#72A0C1'}}>
            <h5>Gestion des Tâches</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="etat" className="form-label">
                  Etat
                </label>
                <select
                  id="etat"
                  name="etat"
                  className="form-select"
                  value={filters.etat}
                  onChange={handleFilterChange}
                >
                  <option value="">Veuillez choisir l'etat</option>
                  {uniqueEtat.map((etat, index) => (
                    <option key={index} value={etat}>
                      {etat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="Intervenant" className="form-label">
                  Intervenant
                </label>
                <select
                  id="Intervenant"
                  name="Intervenant"
                  className="form-select"
                  value={filters.Intervenant}
                  onChange={handleFilterChange}
                >
                  <option value="">Veuillez choisir l'intervenant</option>
                  {uniqueIntervenant.map((Intervenant, index) => (
                    <option key={index} value={Intervenant}>
                      {Intervenant}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="date_prevus" className="form-label">
                  Date debut
                </label>
                <select
                  id="date_prevus"
                  name="date_prevus"
                  className="form-select"
                  value={filters.date_prevus}
                  onChange={handleFilterChange}
                >
                  <option value="">Veuillez choisir le date debut de tache</option>
                  {uniqueDatePrevus.map((date_prevus, index) => (
                    <option key={index} value={date_prevus}>
                      {date_prevus}
                    </option>
                  ))}
                </select>
              </div>
               <div className="col-md-6">
                <label htmlFor="date_de_realisation" className="form-label">
                  Date de realisation
                </label>
                <select
                  id="date_de_realisation"
                  name="date_de_realisation"
                  className="form-select"
                  value={filters.date_de_realisation}
                  onChange={handleFilterChange}
                >
                  <option value="">Veuillez choisir le date de realisation</option>
                  {uniqueDateDeRealisation.map((date_de_realisation, index) => (
                    <option key={index} value={date_de_realisation}>
                      {date_de_realisation}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 d-flex align-items-end mt-3">
                <button className="btn btn-transparent text-light me-2" style={{ background: '#72A0C1'}}>Appliquer les filtres</button>
                <button className="btn btn-secondary" onClick={handleResetFilters}>
                  Réinitialiser filtres
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="liste card mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between mb-3">
              <button className="btn btn-info" onClick={() => handleShow('add')}>+ Nouvelle Tâche</button>
              <input type="text" className="form-control w-25" placeholder="Rechercher" value={searchTerm}
                onChange={handleSearchChange} />
            </div>
            <div className="table-responsive">
              <table className="table table-striped contact-table">
                <thead>
                  <tr>
                    <th>Etat</th>
                    <th>Intitulé</th>
                    <th>Intervenant</th>
                    <th>Date prévue</th>
                    <th>Date de réalisation</th>
                    <th>Commentaire</th>
                    <th>Liens agenda</th>
                    <th>Contact clientt</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTaches.length > 0 ? (
                    currentTaches.map((tache) => (
                      <tr key={tache.id}>
                        <td  className={tache.etat === 'Réalisé' ? 'text-success' : tache.etat === 'En retard' ? 'text-danger' :  tache.etat === 'A faire' ? 'text-primary' : tache.etat === 'En cours' ? 'text-warning':''}>{tache.etat}</td>
                        <td>{tache.intitule}</td>
                        <td>
                          {tache.nom} 
                          {tache.nom === 'Tâche non effectuée' && (
                            <span style={{ color: 'red' }}></span>
                          )}
                        </td>
                        <td>{tache.date_prevus}</td>
                        <td>{tache.date_de_realisation }</td>
                        <td>{tache.commentaire || 'N/A'}</td>
                        <td>{tache.lien_angenda || 'N/A'}</td>
                        <td>{tache.phone || 'N/A'}</td>
                        <td className="d-flex justify-content-between">
                          <Button variant="outline-primary" size="sm" onClick={() => handleShow('edit', tache)}>
                            <FaPenAlt />
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(tache)}>
                            <FaTrashAlt />
                          </Button>
                        </td>
                      </tr>
                    ))
                    ) : (
                      <tr>
                        <td colSpan="10" className="text-center">
                          Aucune tâche trouvée.
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
            
            <nav>
              <ul className="pagination justify-content-center">
                {Array.from({ length: Math.ceil(filteredTaches.length / tachesPerPage) }, (_, index) => (
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

        <Modal show={showModal} onHide={handleClose} size="xl" aria-labelledby="contained-modal-title-vcenter" centered>
  <Modal.Header closeButton style={{background:'#72A0C1'}} className='text-light'>
    <Modal.Title>{modalMode === 'add' ? 'Ajout Tâche' : 'Modifier Tâche'}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form onSubmit={handleSubmit}>
    <div className="row py-3 px-3">
        <div className="col-md-4">
          <Form.Group controlId="intitule">
            <Form.Label>Intitulé</Form.Label>
            <Form.Control
              type="text"
              name="intitule"
              value={newTache.intitule}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </div>
        <div className="col-md-4">
        <Form.Group controlId="commentaire">
            <Form.Label>Commentaire</Form.Label>
            <Form.Control
              as="textarea" aria-label="With textarea"
              type="text"
              name="commentaire"
              value={newTache.commentaire}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group controlId="date_prevus">
            <Form.Label>Date prévue</Form.Label>
            <Form.Control
              type="date"
              name="date_prevus"
              value={newTache.date_prevus}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Affecter la tâche"
              onChange={(e) => {
                const isChecked = e.target.checked;
                setShowContactForm(isChecked); // Met à jour l'état d'affichage du formulaire contact
                setNewTache({ ...newTache, etat: isChecked ? 'En cours' : '' });
              }}
            />
          </Form.Group>
          
          {showContactForm && (
            <Form.Group controlId="Intervenant">
              <Form.Label>Intervenant</Form.Label>
              <Form.Control
                as="select"
                name="Intervenant"
                value={newTache.Intervenant || ''}
                onChange={handleInputChange}
              >
                <option value="">-- Sélectionnez un intervenant --</option>
                {employers.map((employer) => (
                  <option key={employer.id} value={employer.id}>
                    {employer.nom}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          )}
          </div>
          <div className="col-md-4">
          <Form.Group controlId="lien_angenda">
            <Form.Label>Lien agenda</Form.Label>
            <Form.Control
              type="text"
              name="lien_angenda"
              value={newTache.lien_angenda}
              onChange={handleInputChange}
            />
          </Form.Group>
          </div>
          <div className="col-md-4">
          <Form.Group controlId="numero_contact">
            <Form.Label>Contact client</Form.Label>
            <Form.Select
              id="contactSelect"
              name='numero_contact'
              className="form-select"
              value={newTache.numero_contact}
              onChange={handleInputChange}
            >
              <option value="">-- Sélectionnez un contact --</option>
              {contact.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.phone} {contact.nom}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          </div>
          {/* <Form.Group controlId="numero_employer">
            <Form.Label>Numéro employé</Form.Label>
            <Form.Control
              type="text"
              name="numero_employer"
              value={newTache.numero_employer}
              onChange={handleInputChange}
            />
          </Form.Group> */}
          <div className="col-md-4">
          {/* Affichage conditionnel pour le champ "État" */}
          {modalMode === 'edit' && (
          <Form.Group controlId="etat">
            <Form.Label>État</Form.Label>
            <Form.Control
              as="select"
              name="etat"
              value={newTache.etat}
              onChange={handleInputChange}
              required
            >
              <option value="">Sélectionnez un état</option>
              <option value="A faire"> A faire</option>
              <option value="En cours">En cours</option>
              <option value="Réalisé">Réalisé</option>
              <option value="En retard">En retard</option>
            </Form.Control>
          </Form.Group>
        )}
        </div>
          {/* Affichage de la date de réalisation si l'état est "Réalisé" */}
          {modalMode === 'edit' && newTache.etat === 'Réalisé' && (
            <div className="col-md-4">
            <Form.Group controlId="date_de_realisation">
            <Form.Label>Date de réalisation</Form.Label>
            <Form.Control
              type="date"
              name="date_de_realisation"
              value={newTache.date_de_realisation || new Date().toISOString().split('T')[0]}
              onChange={handleInputChange}
            />
          </Form.Group>
          </div>
        )}
        </div>

          <Button variant="primary" type="submit" className="mt-3">
            {modalMode === 'add' ? 'Ajouter' : 'Mettre à jour'}
          </Button>
          <Button variant="dark" type="submit" className="mt-3 ms-3" onClick={handleClose}>
                  Anuler
          </Button>
          
    </Form>
  </Modal.Body>
</Modal>

        <Modal show={showConfirmModal} onHide={handleCloseConfirmModal}  aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Header closeButton style={{ background: '#72A0C1'}}>
            <Modal.Title>Confirmation de suppression</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Êtes-vous sûr de vouloir supprimer la tâche "{tacheToDelete?.intitule}" ?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseConfirmModal}>
              Annuler
            </Button>
            <Button variant="danger" onClick={deleteTache}>
              Supprimer
            </Button>
          </Modal.Footer>
        </Modal>

    </div>
  );
}
