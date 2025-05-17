import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [newTasks, setNewTasks] = useState([]);
  const [unreadTaskCount, setUnreadTaskCount] = useState(0);

  useEffect(() => {
    const fetchTaches = async () => {
      try {
        const response = await axios.get('/Taches');
        const unreadTasks = response.data.filter(task => !task.viewed);
        setNewTasks(unreadTasks);
        setUnreadTaskCount(unreadTasks.length);
      } catch (error) {
        console.error('Erreur lors de la récupération des tâches:', error);
      }
    };
    fetchTaches();
  }, []);

// Dans NotificationContext.jsx
const markTaskAsViewed = async (taskId) => {
  try {
    // Mettre à jour le statut viewed de la tâche
    await axios.put(`/Taches/${taskId}`, {
      viewed: true,
      _method: 'PUT' // Important pour Laravel
    });

    // Mettre à jour l'état local
    setNewTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    setUnreadTaskCount(prev => prev - 1);

    // Retourner true pour indiquer le succès
    return true;
  } catch (error) {
    console.error('Erreur lors du marquage de la tâche comme vue:', error);
    return false;
  }
};

  return (
    <NotificationContext.Provider value={{ 
      newTasks, 
      unreadTaskCount, 
      markTaskAsViewed,
      setNewTasks  // Ajouter setNewTasks ici
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);