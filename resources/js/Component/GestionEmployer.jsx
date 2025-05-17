import React, { useState } from 'react'; // Import de useState
import Headers from './Page/Headers';
import Sidebar from './Page/Sidebar';
import './Acceuil.css'
import Employer from './Employer';

function GestionEmployer() {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [newTasks, setNewTasks] = useState([]);
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };
  const handleNewTaskAdded = (tasks) => {
    setNewTasks(tasks);
  };
  
  return (
    <div className='acceuil'>
      <Headers toggleSidebar={toggleSidebar}  newTasks={newTasks} />
      
      <div className="d-flex ">
        <Sidebar isVisible={isSidebarVisible} />
        
        <div className="d-flex" style={{marginLeft: isSidebarVisible ? '250px' : '0', width: isSidebarVisible ? 'calc(150% - 300px)' : '100%',marginTop: '73px'}}>
          <Employer onNewTaskAdded={handleNewTaskAdded} />
        </div>
      </div>
    </div>
  );
}

export default GestionEmployer;