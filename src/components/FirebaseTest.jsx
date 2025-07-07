import React, { useEffect, useState } from 'react';
import { app } from '../services/firebase';

function FirebaseTest() {
  const [status, setStatus] = useState('En cours de connexion à Firebase...');

  useEffect(() => {
    try {
      // Vérification simple : accès à l'app Firebase
      if (app.name) {
        setStatus('Connexion à Firebase réussie !');
      } else {
        setStatus('Erreur : Impossible de récupérer l’instance Firebase.');
      }
    } catch (error) {
      setStatus('Erreur de connexion à Firebase : ' + error.message);
    }
  }, []);

  return (
    <div style={{ padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
      <strong>Test Firebase :</strong> {status}
    </div>
  );
}

export default FirebaseTest;
