import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import AuthForms from '../components/AuthForms';

/**
 * Pagina dedicata alla creazione di un nuovo account.
 * Fornisce contesto e istruzioni rapide prima di mostrare il form di registrazione.
 */
export default function RegisterPage({ onLogin }) {
  return (
    <div className="d-flex flex-column gap-4">
      <Card bg="light" border="secondary">
        <Card.Body>
          <Card.Title>Perché creare un account?</Card.Title>
          <Card.Text>
            Registrandoti ottieni un profilo personale che conserva le tue attività
            su qualsiasi dispositivo. Bastano pochi secondi:
          </Card.Text>
          <ListGroup variant="flush">
            <ListGroup.Item>1. Inserisci i tuoi dati personali.</ListGroup.Item>
            <ListGroup.Item>2. Scegli una password sicura.</ListGroup.Item>
            <ListGroup.Item>3. Conferma e inizia subito a usare la dashboard.</ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
      <AuthForms mode="register" onLogin={onLogin} />
    </div>
  );
}
