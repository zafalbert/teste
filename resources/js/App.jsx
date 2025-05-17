// resources/js/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Component/Logine'; // Import de la page Login
import ReactDOM from 'react-dom/client';
import Acceuil from './Component/Acceuil';
import { NotificationProvider } from './Component/NotificationContext';
import GestionDeTache from './Component/GestionDeTache';
import GestionProspection from './Component/GestionProspection';
import PresentationOffre from './Component/GestionOffre';
import Devis from './Component/GestionDeDevis';
import Offre from './Component/GererOffre';
import GestionDeDocument from './Component/GestionDeDocument';
import SuivieInteraction from './Component/SuivieInteraction';
import HistoriqueAppel from './Component/GererHistoriqueAppel';
import HistoriqueEmail from './Component/GereraHistoriqueEmail';
import Rapport from './Component/Rapport';
import GestionEmployer from './Component/GestionEmployer';
import GestionUtilisateur from './Component/GestionUtilisateur';

const root = ReactDOM.createRoot(document.getElementById('app')); 
root.render(<App />);
export default function App() {
  return (
    <NotificationProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path='/Accueil' element={<Acceuil/>}/>
        <Route path='/GestionDeTache' element={<GestionDeTache/>}/>
        <Route path='/GestionProspection' element={<GestionProspection/>}/>
        <Route path='/GestionOffre' element={<PresentationOffre/>}/>
        <Route path='/GestionDeDevis' element={<Devis/>}/>
        <Route path='/GererOffre' element={<Offre/>}/>
        <Route path='/GestionDeDocument' element={<GestionDeDocument/>}/>
        <Route path='/SuivieInteraction' element={<SuivieInteraction/>}/>
        <Route path='/HistoriqueAppel' element={<HistoriqueAppel/>}/>
        <Route path='/HistoriqueEmail' element={<HistoriqueEmail/>}/>
        <Route path='/Rapport' element={<Rapport/>}/>
        <Route path='/GestionEmployer' element={<GestionEmployer/>}/>
        <Route path='/GestionUtilisateur' element={<GestionUtilisateur/>}/> 
      </Routes>
    </Router>
    </NotificationProvider>
  );
}
