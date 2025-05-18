import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';  // Assurez-vous d'avoir aussi inclus le JS Bootstrap
import './Logine.css';
import axios from 'axios';

export default function Logine() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
    
        try {
            // Première requête pour obtenir le cookie CSRF
            await axios.get('/sanctum/csrf-cookie');
            
            // Requête de connexion
            const response = await axios.post('/login', {
                email,
                password,
                remember: rememberMe
            });
    
            if (response.data.status) {
                setShowModal(true);
            } else {
                setError(response.data.message || "Erreur d'authentification");
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            setError(error.response?.data?.message || "Une erreur s'est produite. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleModalClose = () => {
        setShowModal(false);
        navigate('/Accueil');  // Redirigez l'utilisateur vers la page d'accueil après la fermeture de la modale
    };

    const Loading = () => {
        return (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        );
    };

    return (
        <main className='login-background '>
            <div className=" login-overlay container">
                <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                    <div className="login-content container">
                        <div className="row justify-content-center">
                            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                                <div className="contenue card mb-3 " >
                                    <div className="card-body">
                                        <div className="pt-4 pb-2">
                                            <div className="d-flex justify-content-center py-4">
                                               <img src="/crm-logo.png" alt="Logo" style={{ width: 100, height: 65 }} />
                                            </div>
                                            <h5 className="card-title text-center pb-0 fs-4 text-dark">Login</h5>
                                            <p className="text-center pb-0 fs-2 text-dark">CRM</p>
                                        </div>
                                        <form className="row g-3 needs-validation" onSubmit={handleSubmit}>
                                            {error && (
                                                <div className="col-12">
                                                    <div className="alert alert-danger" role="alert">
                                                        {error}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="col-12">
                                                <label htmlFor="email" className="form-label">Email</label>
                                                <input 
                                                    type="email" 
                                                    className='form-control' 
                                                    id='email' 
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required 
                                                />
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="password" className="form-label">Mot de Passe</label>
                                                <input 
                                                    type="password" 
                                                    className='form-control' 
                                                    id='password' 
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required 
                                                />
                                            </div>
                                            <div className="col-12">
                                                <div className="form-check">
                                                    <input 
                                                        type="checkbox" 
                                                        className='form-check-input' 
                                                        id='rememberMe' 
                                                        checked={rememberMe}
                                                        onChange={(e) => setRememberMe(e.target.checked)}
                                                    />
                                                    <label htmlFor="rememberMe" className='form-check-label'>Se souvenir de moi</label>
                                                </div>
                                            </div>
                                            
                                            <div className="col-12">
                                                <button 
                                                    className='btn btn-primary w-100' 
                                                    type='submit'
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? <Loading /> : 'Se connecter'}
                                                </button>
                                            </div>
                                            {/* <div className="col-12 justify-content-center align-items-center d-flex">
                                                <a href="/register" className='justify-content-center align-items-center'>Mot de passe oublier</a>
                                            </div> */}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            {showModal && (
                <div className="modal show" style={{ display: 'block'  }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="btn-close" onClick={handleModalClose}></button>
                            </div>
                            <div className="modal-body">
                                <p>Bienvenue {email} ! Vous êtes connecté avec succès.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={handleModalClose}>
                                    Continuer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
