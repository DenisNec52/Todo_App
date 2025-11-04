# Todo App

Applicazione ToDo full-stack con autenticazione utenti basata su Node.js, Express, MongoDB ed EJS. Permette di registrarsi, accedere e gestire liste di attività personali in modo sicuro tramite sessioni persistenti.

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
├── controllers/     # Logica applicativa per auth e todo
├── middleware/      # Middleware personalizzati
├── models/          # Modelli Mongoose (User, Todo)
├── routes/          # Definizione delle rotte Express
├── views/           # Template EJS
└── server.js        # Entry point dell'applicazione
public/
└── css/             # Stili globali
```

## Script disponibili

- `npm run dev` – avvia il server in modalità sviluppo
- `npm start` – avvia il server in modalità produzione

## Licenza

Questo progetto è distribuito con licenza ISC.
