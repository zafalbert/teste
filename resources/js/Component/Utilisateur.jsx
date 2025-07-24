import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTrashAlt, FaPenAlt } from 'react-icons/fa';
import { Modal, Button, Form, Pagination } from 'react-bootstrap';
import './Contact.css';

export default function Utilisateur({ onNewTaskAdded }) {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showPasswordField, setShowPasswordField] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [utilisateurToDelete, setUtilisateurToDelete] = useState(null); // Store contact for deletion
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: '',
        entreprise: '',
        password: '',
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [error, setError] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUser, setFilteredUser] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [userPerPage] = useState(5)

    const indexOfLastDocument = currentPage * userPerPage;
    const indexOfFirstDocument = indexOfLastDocument - userPerPage;
    const currentUsers = filteredUser.slice(indexOfFirstDocument, indexOfLastDocument);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Réinitialiser à la première page
    };


    useEffect(() => {
      const filteredUser = users.filter(users => {
        const matchesSearchQuery =
            users.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            users.email.toString().toLowerCase().includes(searchQuery.toLowerCase()) || // Convertir prix en string
            users.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            users.entreprise.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesSearchQuery;
      });
    
      setFilteredUser(filteredUser);
    }, [users, searchQuery]); 

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/Utilisateurs');
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs :', error);
            setUsers([]);
        }
    };

    const handleSubmit = async () => {
        try {
            setError('');
            if (selectedUser) {
                // Mise à jour d'un utilisateur existant
                await updateUser();
            } else {
                // Création d'un nouvel utilisateur
                await createUser();
            }
            handleClose();
            fetchUsers();
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setError(error.response.data.message);
            } else {
                setError("Une erreur est survenue lors de l'opération");
            }
        }
    };

    const createUser = async () => {
        const response = await axios.post('/Utilisateurs', newUser);
        return response.data;
    };

    const updateUser = async () => {
        const updatedUser = { ...newUser };
        if (!updatedUser.password) {
            delete updatedUser.password;
        }
        const response = await axios.put(`/Utilisateurs/${selectedUser.id}`, updatedUser);
        return response.data;
    };

    const deleteUser = async (id) => {
        try {
            await axios.delete(`/Utilisateurs/${utilisateurToDelete.id}`);
            fetchUsers();
            setShowConfirmModal(false); // Fermer la boîte de confirmation
        } catch (error) {
            console.error("Erreur lors de la suppression d'un utilisateur :", error);
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setShowPasswordField(false);
        setNewUser({
            name: '',
            email: '',
            role: '',
            entreprise: '',
            password: '',
        });
        setSelectedUser(null);
        setError('');
    };

    const handleCloseConfirmModal = () => setShowConfirmModal(false);

    const handleShow = () => {
        setShowModal(true);
        setSelectedUser(null);
    };
// Fonction pour ouvrir la boîte de confirmation avant suppression
const confirmDelete = (user) => {
    setUtilisateurToDelete(user);
    setShowConfirmModal(true); // Afficher la boîte de confirmation
  };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({
            ...newUser,
            [name]: value,
        });
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setNewUser({
            ...user,
            password: '', // On ne récupère jamais le mot de passe
        });
        setShowModal(true);
        setShowPasswordField(false);
    };
   return (
       <div className="contact-container container">
           {/* Gestion des utilisateurs */}
           <div className="card mb-4 mt-5">
               <div className="card-header text-white" style={{ background: '#72A0C1' }}>
                   <h5>Gestion des utilisateurs</h5>
               </div>
           </div>

           {/* Liste des utilisateurs */}
           <div className="liste card mb-4">
               <div className="card-body">
                   <div className="d-flex justify-content-between mb-3">
                       <button className="btn btn-info" onClick={() => handleShow()}>+ Nouveau utilisateur</button>
                       <input type="text" className="form-control w-25" value={searchQuery} onChange={handleSearchChange} placeholder="Rechercher" />
                   </div>
                   <div className="table-responsive">
                       <table className="table table-striped contact-table">
                           <thead>
                               <tr>
                                   <th>Nom</th>
                                   <th>Email</th>
                                   <th>Role</th>
                                   <th>Entreprise</th>
                                   <th>Actions</th>
                               </tr>
                           </thead>
                           <tbody>
                            {currentUsers.map(users => (
                                <tr key={users.id}>
                                <td>{users.name}</td>
                                <td>{users.email}</td>
                                <td>{users.role}</td>
                                <td>{users.entreprise}</td>
                                <td className='d-flex ms-1'>
                                    <button className="btn btn-sm btn-outline-primary ms-1" onClick={() => handleEditUser(users)}>
                                        <FaPenAlt />
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => confirmDelete(users)}>
                                        <FaTrashAlt />
                                    </button>           
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
                  {Array.from({ length: Math.ceil(filteredUser.length / userPerPage) }, (_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button onClick={() => paginate(i + 1)} className="page-link">{i + 1}</button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
               </div>
           </div>

           {/* Modal for Adding or Editing Users */}
           <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {selectedUser ? "Modifier l'utilisateur" : 'Ajouter un utilisateur'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && (
                        <div className="alert alert-danger">{error}</div>
                    )}
                   <Form>
                       <div className="row">
                           <div className="col-md-6">
                               <Form.Group controlId="name">
                                   <Form.Label>Nom</Form.Label>
                                   <Form.Control
                                       type="text"
                                       name="name"
                                       placeholder="Nom"
                                       value={newUser.name}
                                       onChange={handleInputChange}
                                   />
                               </Form.Group>
                           </div>
                           <div className="col-md-6">
                               <Form.Group controlId="email">
                                   <Form.Label>Email</Form.Label>
                                   <Form.Control
                                       type="email"
                                       name="email"
                                       placeholder="Email"
                                       value={newUser.email}
                                       onChange={handleInputChange}
                                   />
                               </Form.Group>
                           </div>
                       </div>
                       <div className="row mt-3">
                           <div className="col-md-6">
                               <Form.Group controlId="role">
                                   <Form.Label>Role</Form.Label>
                                   <Form.Control
                                       type="text"
                                       name="role"
                                       placeholder="Role"
                                       value={newUser.role}
                                       onChange={handleInputChange}
                                   />
                               </Form.Group>
                           </div>
                           <div className="col-md-6">
                               <Form.Group controlId="entreprise">
                                   <Form.Label>Entreprise</Form.Label>
                                   <Form.Control
                                       type="text"
                                       name="entreprise"
                                       placeholder="Entreprise"
                                       value={newUser.entreprise}
                                       onChange={handleInputChange}
                                   />
                               </Form.Group>
                           </div>
                       </div>
                       <div className="row mt-3">
                           <div className="col-md-6">
                               <Button
                                   variant="secondary"
                                   onClick={() => setShowPasswordField(true)}
                               >
                                   Gérer mot de passe
                               </Button>
                           </div>
                           {showPasswordField && (
                               <div className="col-md-6">
                                   <Form.Group controlId="password">
                                       <Form.Control
                                           type="password"
                                           className='form-control'
                                           name="password"
                                           placeholder="Mot de passe"
                                           value={newUser.password}
                                           onChange={handleInputChange}
                                       />
                                   </Form.Group>
                               </div>
                           )}
                       </div>
                   </Form>
               </Modal.Body>
               <Modal.Footer>
               <Button variant="primary" onClick={handleSubmit}>
                    {selectedUser ? 'Modifier' : 'Créer'}
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Annuler
                </Button>
               </Modal.Footer>
           </Modal>
        {/* Modale de confirmation avant suppression */}
               <Modal show={showConfirmModal} onHide={handleCloseConfirmModal} aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton style={{ background: '#72A0C1'}}>
                  <Modal.Title>Confirmation de suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Êtes-vous sûr de vouloir supprimer {utilisateurToDelete?.nom}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseConfirmModal}>
                    Annuler
                  </Button>
                  <Button variant="danger" onClick={deleteUser}>
                    Supprimer
                  </Button>
                </Modal.Footer>
              </Modal>
       </div>
   );
}
