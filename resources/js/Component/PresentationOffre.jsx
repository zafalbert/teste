import React,{useEffect, useState} from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import './Presentation.css'
import { Link } from 'react-router-dom';

const PresentationOffre = () => {
  const [offres, setOffres] = useState([]);

  useEffect(() => {
    fetchOffres();
  }, []);

  

  const fetchOffres = async () => {
    try {
      const response = await axios.get('/Offres');
      setOffres(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des offres:", error);
    }
  };
  


  // function OutlineTypesExample() {
  //   return (
  //     <>
  //       <Link to='/GestionOffre'  className="btn btn-outline-secondary  text-secondary"  ><i class="bi bi-cart3" >  Presentation des offres</i></Link>{' '}
  //       <Link to='/GestionDeDevis' className='ms-2 btn btn-outline-secondary  text-secondary'><i class="bi bi-cash-coin">  Gestion des devis</i></Link>{' '}
  //       <Link to='/GererOffre' className='ms-2 btn btn-outline-secondary text-secondary'><i class="bi bi-cart3">  Gestion des offres</i></Link>
  //     </>
  //   );
  // }

  const getColorByIndex = (index) => {
    const colors = ['#3392ff', '#faf605', '#ff242fd3']; // Trois couleurs
    return colors[index % colors.length];
  };

  return (
    <Container className="presentation-container mt-4" >
        <div className='mt-1'>
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
      <div className="card-header text-white mt-3 "  style={{ background: '#72A0C1', height:'8vh',padding:'3px', borderRadius:'8px'}}>
          <h5>Gestion des devis/offre</h5>
        </div>
            
    
      <Card className='mt-3'>
        <Card.Body>
          <h5 className="mb-4">OFFRES DISPONIBLE</h5>
          <Row>
            {offres.map((offre, index) => (
              <Col key={index} md={4}
              >
                <Card className='mt-3' >
                  <Card.Header className="text-center"
                   style={{
                    backgroundColor: getColorByIndex(index),
                    color: 'white' // Pour s'assurer que le texte est visible avec les couleurs de fond
                  }}>
                  <h4 key={offre.titre} value={offre.titre}>
                      {offre.titre}
                      </h4>
                  </Card.Header>
                  <Card.Body>
                  <Card.Title className="text-center" key={`${offre.prix}-${offre.uniter}`}>
                    {offre.prix} {offre.uniter}<small>/mois</small>
                  </Card.Title>

                    <ul className="list-unstyled">
                        <li key={index}>✓ {offre.contenus}</li>
                      
                    </ul>
                    <Button variant="light" className='w-100'
                     style={{
                      backgroundColor: getColorByIndex(index),
                      color: 'white' // Pour s'assurer que le texte est visible avec les couleurs de fond
                    }}>Ça m'intéresse</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
      <footer className="text-center mt-4">
        <small>Copyright © 2022. Tout droit réserver.</small>
      </footer>
    </Container>
  );
};

export default PresentationOffre;