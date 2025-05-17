import React, { useState, useEffect } from 'react';
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

const Document = () => {
  const [documents, setDocuments] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [newDocument, setNewDocument] = useState({
    file_path:'',
    type: '',
    client_proprietaire: '',
    date_document: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [documentsPerPage] = useState(5);
 

  useEffect(() => {
    fetchDocuments();
    fetchContacts();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('/Document');
      setDocuments(response.data);
      setFilteredDocuments(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des documents:", error);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await axios.get('/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des contacts:", error);
    }
  };

  const handleShow = (mode, document = null) => {
    setModalMode(mode);
    setSelectedFile(null); // Réinitialiser le fichier sélectionné
    if (mode === 'edit' && document) {
      setNewDocument({
        id: document.id,
        type: document.type || '',
        client_proprietaire: document.client_proprietaire || '',
        date_document: document.date_document || '',
        file_path: document.file_path || ''
      });
    } else {
      setNewDocument({
        file_path: '',
        type: '',
        client_proprietaire: '',
        date_document: '',
      });
    }
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);
  const handleCloseConfirmModal = () => setShowConfirmModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDocument({
      ...newDocument,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      // Gérer le fichier différemment pour l'ajout et la modification
      if (modalMode === 'add') {
        if (!selectedFile) {
          setAlert({ show: true, message: 'Veuillez sélectionner un fichier', variant: 'danger' });
          return;
        }
        formData.append('file', selectedFile);
      } else if (selectedFile) {
        formData.append('file', selectedFile);
      }
  
      // Ajouter les autres champs
      formData.append('type', newDocument.type);
      formData.append('client_proprietaire', newDocument.client_proprietaire);
      formData.append('date_document', newDocument.date_document);
  
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      };
  
      if (modalMode === 'add') {
        const response = await axios.post('/Document', formData, config);
        setAlert({ show: true, message: 'Document ajouté avec succès.', variant: 'success' });
      } else {
        const response = await axios.post(`/Document/${newDocument.id}?_method=PUT`, formData, config);
        setAlert({ show: true, message: 'Document mis à jour avec succès.', variant: 'success' });
      }
      
      fetchDocuments();
      handleClose();
      setSelectedFile(null);
    } catch (error) {
      console.error("Erreur lors de l'ajout/modification de document:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Une erreur est survenue';
      setAlert({ show: true, message: `Échec de l'opération: ${errorMessage}`, variant: 'danger' });
    }
  };

 
  const confirmDelete = (document) => {
    setDocumentToDelete(document);
    setShowConfirmModal(true);
  };

  const deleteDocument = async () => {
    try {
      await axios.delete(`/Document/${documentToDelete.id}`);
      fetchDocuments();
      setShowConfirmModal(false);
      setAlert({ show: true, message: 'Document supprimé avec succès.', variant: 'success' });
    } catch (error) {
      console.error("Erreur lors de la suppression du document:", error);
      setAlert({ show: true, message: "Échec de la suppression du document.", variant: 'danger' });
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Réinitialiser à la première page
};

useEffect(() => {
  const filteredDocuments = documents.filter(document => {
    const matchesSearchQuery =
      document.file_path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      document.type.toString().toLowerCase().includes(searchQuery.toLowerCase()) || // Convertir prix en string
      document.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      document.date_document.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearchQuery;
  });

  setFilteredDocuments(filteredDocuments);
}, [documents, searchQuery]); // Dépendances pour mettre à jour filteredOffres

const downloadDocument = async (doc) => {
  try {
    const response = await axios.get(`/Document/${doc.id}`, {
      responseType: 'blob', // Important pour les fichiers binaires
    });

    // Extraire le nom de fichier original
    const filename = doc.file_path.split('/').pop();

    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = window.document.createElement('a'); // Utilisation explicite de window.document
    link.href = url;
    link.setAttribute('download', filename);
    window.document.body.appendChild(link);
    link.click();

    // Nettoyer
    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Erreur lors du téléchargement du document:", error);
    setAlert({ 
      show: true, 
      message: "Échec du téléchargement du document", 
      variant: 'danger' 
    });
  }
};


  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = filteredDocuments.slice(indexOfFirstDocument, indexOfLastDocument);

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

      <div className="card mb-4 mt-4">
        <div className="card-header text-white" style={{ background: '#72A0C1'}}>
          <h5>Gestion de document</h5>
        </div>
      </div>
        
        <div className="liste card mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between mb-3">
              <button className="btn btn-info" onClick={() => handleShow('add')}>+ Nouveau document</button>
              <input type="text" className="form-control w-25" placeholder="Rechercher" value={searchQuery} onChange={handleSearchChange} />
            </div>
            <div className='align-items-center justify-content-center bg-dark'>
              <h4 className='text-light'>Liste des documents</h4>
            </div>
            <div className="table-responsive mt-4">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Nom du document</th>
                    <th>Type</th>
                    <th>Client propriétaire</th>
                    <th>Date du document</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDocuments.map(document => (
                    <tr key={document.id}>
                      <td>{document.file_path}</td>
                      <td>{document.type}</td>
                      <td>{document.nom}</td>
                      <td>{document.date_document}</td>
                      <td className='d-flex ms-1'>
                        <Button variant="outline-success" size="sm" onClick={() => downloadDocument(document)}>
                          <i className="bi bi-arrow-bar-down"></i>
                        </Button>
                        <Button variant="outline-primary ms-1" size="sm" onClick={() => handleShow('edit', document)}>
                          <FaPenAlt />
                        </Button>
                        <Button variant="outline-danger ms-1" size="sm" onClick={() => confirmDelete(document)}>
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
                  {Array.from({ length: Math.ceil(filteredDocuments.length / documentsPerPage) }, (_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button onClick={() => paginate(i + 1)} className="page-link">{i + 1}</button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Modal for adding/editing documents */}
          <Modal show={showModal} onHide={handleClose}  size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton style={{background:'#72A0C1'}} className='text-light'>
              <Modal.Title >{modalMode === 'add' ? 'Ajouter un document' : 'Modifier un document'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
              <div className="row py-6 px-3">
                <div className="col-md-6">
                  <Form.Group controlId="file_path">
                      <Form.Label>Nom de document</Form.Label>
                      <Form.Control
                      type="file"
                      name="file_path"
                      onChange={handleFileChange}
                      />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="type">
                    <Form.Label>Type</Form.Label>
                    <Form.Control
                      type="text"
                      name="type"
                      value={newDocument.type}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="client_proprietaire">
                    <Form.Label>Client propriétaire</Form.Label>
                    <Form.Select
                      id="contactSelect"
                      name='client_proprietaire'
                      className="form-select"
                      value={newDocument.client_proprietaire}
                      onChange={handleInputChange}
                    >
                      <option value="">-- Sélectionnez le client propriétaire --</option>
                      {contacts.map((contact) => (
                        <option key={contact.id} value={contact.id}>
                          {contact.nom}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="date_document">
                    <Form.Label>Date du document</Form.Label>
                    <Form.Control
                      type="date"
                      name="date_document"
                      value={newDocument.date_document}
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

          {/* Confirmation Modal */}
          <Modal show={showConfirmModal} onHide={handleCloseConfirmModal} aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton style={{ background: '#72A0C1'}}>
              <Modal.Title>Confirmation de suppression</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Êtes-vous sûr de vouloir supprimer le document "{documentToDelete?.type}" ?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseConfirmModal}>
                Annuler
              </Button>
              <Button variant="danger" onClick={deleteDocument}>
                Supprimer
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
  );
};

export default Document;