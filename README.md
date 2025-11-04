# Todo App

Applicazione full-stack per la gestione di attività personali con autenticazione JWT, sviluppata con Node.js, Express, MongoDB per il backend e React con React Bootstrap per il frontend.

## Funzionalità principali

- Registrazione e login con hashing delle password.
- Gestione completa delle attività (creazione, lettura, aggiornamento e cancellazione).
- Possibilità di segnare le attività come completate o da completare.
- Filtri per stato, tag e ricerca full-text.
- Interfaccia responsive basata su React Bootstrap.

## Struttura del progetto

```
Todo_App/
├── server/   # API REST (Express + MongoDB)
└── client/   # Interfaccia React
```

## Requisiti

- Node.js >= 18
- MongoDB in esecuzione (locale o remoto)

## Configurazione backend

1. Copia il file di esempio `.env`:
   ```bash
   cd server
   cp .env.example .env
   ```
2. Aggiorna le variabili nel file `.env` (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`).
3. Installa le dipendenze e avvia il server:
   ```bash
   npm install
   npm run dev
   ```
   Il server espone le API su `http://localhost:5000`.

## Configurazione frontend

1. Installa le dipendenze:
   ```bash
   cd ../client
   npm install
   ```
2. Avvia l'ambiente di sviluppo:
   ```bash
   npm run dev
   ```
   L'applicazione sarà disponibile su `http://localhost:5173` con proxy automatico verso il backend.

## Script disponibili

### Backend (`server`)
- `npm run dev`: avvia il server con reload automatico.
- `npm start`: avvia il server in modalità produzione.
- `npm run lint`: esegue ESLint sui file del backend.

### Frontend (`client`)
- `npm run dev`: avvia l'ambiente Vite.
- `npm run build`: crea la build di produzione.
- `npm run preview`: avvia un server di anteprima per la build.
- `npm run lint`: esegue ESLint sui file React.

## API principali

### Autenticazione
- `POST /api/auth/register`: crea un nuovo utente.
- `POST /api/auth/login`: effettua il login e restituisce un token JWT.
- `GET /api/auth/me`: restituisce i dati dell'utente autenticato.

### Attività (richiede header `Authorization: Bearer <token>`)
- `GET /api/tasks`: elenco delle attività filtrabile con query (`completed`, `search`, `tag`).
- `POST /api/tasks`: crea una nuova attività.
- `GET /api/tasks/:id`: restituisce i dettagli di una singola attività.
- `PUT /api/tasks/:id`: aggiorna un'attività.
- `DELETE /api/tasks/:id`: elimina un'attività.

## Note

- Assicurati di avere MongoDB in esecuzione e di aggiornare `MONGO_URI` prima di avviare il backend.
- Per la build di produzione puoi distribuire il backend e servire la cartella `client/dist` tramite un web server statico separato.
