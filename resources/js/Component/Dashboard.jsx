import React, { useState, useEffect } from 'react';
import { Card, CardContent, Grid, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const Dashboard = () => {

  const [taches, setTaches] = useState([]);
  const [prospections, setProspections] = useState([]);


  const fetchProspections = async () => {
    try {
      const response = await axios.get('/Prospections');
      setProspections(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des prospections:", error);
      setAlert({ show: true, message: 'Erreur lors de la récupération des prospections.', variant: 'danger' });
    }
  };

  const fetchTaches = async () => {
    try {
      const response = await axios.get('/Taches');
      setTaches(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des prospections:", error);
      setAlert({ show: true, message: 'Erreur lors de la récupération des prospections.', variant: 'danger' });
    }
  };

  useEffect(() => {
    fetchProspections();
    fetchTaches();
  }, [taches, prospections]);
  

  // Calcul des statistiques
  const totalTaches = taches?.length || 0;
  const totalProspections = prospections?.length || 0;

  const getStatusCount = (items, status) => items?.filter(item => item.etat === status).length || 0;

  const tachesParEtat = {
    Réalisé: getStatusCount(taches, 'Réalisé'),
    'En retard': getStatusCount(taches, 'En retard'),
    'A faire': getStatusCount(taches, 'A faire'),
    'En cours': getStatusCount(taches, 'En cours')
  };

  const prospectionsParEtat = {
    Réalisé: getStatusCount(prospections, 'Réalisé'),
    'En retard': getStatusCount(prospections, 'En retard'),
    'A faire': getStatusCount(prospections, 'A faire'),
    'En cours': getStatusCount(prospections, 'En cours')
  };

  const dataTaches = [
    { name: 'Réalisé', value: tachesParEtat.Réalisé, color: '#28a745' },
    { name: 'En retard', value: tachesParEtat['En retard'], color: '#dc3545' },
    { name: 'A faire', value: tachesParEtat['A faire'], color: '#007bff' },
    { name: 'En cours', value: tachesParEtat['En cours'], color: '#ffc107' }
  ];

  const dataProspections = [
    { name: 'Réalisé', value: prospectionsParEtat.Réalisé, color: '#28a745' },
    { name: 'En retard', value: prospectionsParEtat['En retard'], color: '#dc3545' },
    { name: 'A faire', value: prospectionsParEtat['A faire'], color: '#007bff' },
    { name: 'En cours', value: prospectionsParEtat['En cours'], color: '#ffc107' }
  ];

  return (
    <Box p={2} >
      <Typography variant="h4" sx={{ mb: 2, color: 'white', backgroundColor: '#464B6A', padding: '5px', borderRadius: '8px', marginTop:'10px' }}>
        Tableau de bord
      </Typography>
      
      <Grid container spacing={4}>
        {/* Total des tâches */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderLeft: '5px solid #007bff' }}>
            <CardContent sx={{padding:'5px'}}>
              <Typography variant="h6" color="textSecondary">
                Total des tâches
              </Typography>
              <Typography variant="h5" color="primary">
                {totalTaches}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total des Prospections */}
        <Grid item xs={10} md={6}>
          <Card sx={{ borderLeft: '5px solid #ff9800'}}>
            <CardContent sx={{padding:'5px'}}>
              <Typography variant="h6" color="textSecondary">
                Total des Prospections clients
              </Typography>
              <Typography variant="h5" sx={{ color: '#ff9800' }}>
                {totalProspections}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Suivi KPI des tâches */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{padding:'5px'}}>
              <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
                Suivi KPI des tâches
              </Typography >
              {taches.length > 0 && (
                <PieChart width={300} height={300}>
                <Pie
                  data={dataTaches}
                  cx="30%"
                  cy="30%"
                  innerRadius={30}
                  outerRadius={45}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataTaches.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              )}
              <Box mt={-16}> 
                {dataTaches.map((item, index) => (
                  <Box display="flex" alignItems="center" justifyContent="space-between" key={index}>
                    <Box display="flex" alignItems="center">
                      <Box width={12} height={12} mr={1} borderRadius="50%" bgcolor={item.color}></Box>
                      <Typography>{item.name}</Typography>
                    </Box>
                    <Typography color={item.color}>{item.value}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Suivi KPI des Prospections */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{padding:'5px'}}>
              <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
                Suivi KPI des prospections
              </Typography>
              { prospections.length > 0 && (
                 <PieChart width={300} height={300}>
                 <Pie
                   data={dataProspections}
                  cx="30%"
                  cy="30%"
                  innerRadius={30}
                  outerRadius={45}
                  paddingAngle={5}
                  dataKey="value"
                 >
                   {dataProspections.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
               </PieChart>
              )}
             
              <Box mt={-16}>
                {dataProspections.map((item, index) => (
                  <Box display="flex" alignItems="center" justifyContent="space-between" key={index}>
                    <Box display="flex" alignItems="center">
                      <Box width={12} height={12} mr={1} borderRadius="50%" bgcolor={item.color}></Box>
                      <Typography>{item.name}</Typography>
                    </Box >
                    <Typography color={item.color}>{item.value}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
