# Todo App

Applicazione ToDo full-stack con autenticazione utenti basata su Node.js, Express, MongoDB ed EJS. Permette di registrarsi, accedere e gestire liste di attività personali in modo sicuro tramite sessioni persistenti.

In aggiunta all'interfaccia server-side è ora disponibile un client opzionale sviluppato in React + React-Bootstrap sotto la cartella `client/`, pensato per chi preferisce un'esperienza single-page application.

## Requisiti

- Node.js 18+
- MongoDB 5+

## Configurazione

1. Copia il file `.env.example` in `.env` e personalizza i valori:

   ```bash
   cp .env.example .env
   ```

   Variabili richieste:

   - `MONGODB_URI`: stringa di connessione a MongoDB
   - `SESSION_SECRET`: chiave segreta per firmare le sessioni
   - `PORT` (opzionale): porta su cui esporre l'applicazione (default `3000`)

2. Installa le dipendenze:

   ```bash
   npm install
   ```

3. Avvia l'applicazione in modalità sviluppo:

   ```bash
   npm run dev
   ```

   oppure in produzione:

   ```bash
   npm start
   ```

L'applicazione sarà disponibile all'indirizzo `http://localhost:3000`.

## Funzionalità

- Registrazione e login utenti con password crittografate tramite bcrypt.
- Gestione sessioni persistenti con `express-session` e salvataggio su MongoDB (`connect-mongo`).
- CRUD delle attività personali: creazione, completamento/riapertura e cancellazione.
- Interfaccia server-side renderizzata con EJS e layout responsive.
- Messaggi di feedback (successo/errore) tramite `express-flash`.

## Struttura del progetto

```
src/
├── config/          # Configurazioni (es. database)
├── controllers/     # Logica applicativa per auth, todo e API
├── middleware/      # Middleware personalizzati
├── models/          # Modelli Mongoose (User, Todo)
├── routes/          # Definizione delle rotte Express e API JSON
├── views/           # Template EJS
└── server.js        # Entry point dell'applicazione
client/
├── public/          # HTML di ingresso per Vite
└── src/             # Codice React e componenti
public/
└── css/             # Stili globali
```

## Script disponibili

- `npm run dev` – avvia il server in modalità sviluppo
- `npm start` – avvia il server in modalità produzione

### Client React

Per utilizzare l'interfaccia React (facoltativa):

```bash
cd client
npm install
npm run dev
```

Durante lo sviluppo Vite inoltra automaticamente le chiamate API verso il backend Express (porta 3000 di default). Per creare una build ottimizzata eseguire `npm run build` nella cartella `client`.

All'interno della cartella `client` sono disponibili anche gli script:

- `npm run lint` – verifica lo stile del codice React
- `npm run format` – formatta automaticamente file JavaScript/JSX/CSS tramite Prettier

L'interfaccia single-page utilizza React-Bootstrap, animazioni CSS dedicate e placeholder dinamici per rendere più fluide le transizioni tra login, registrazione e dashboard.

## Licenza

Questo progetto è distribuito con licenza ISC.
