require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const methodOverride = require('method-override');
const { connectDatabase } = require('./config/database');

const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const indexRoutes = require('./routes/index');
const apiRoutes = require('./routes/api');

const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo_app';
const SESSION_SECRET = process.env.SESSION_SECRET || 'change-me';

connectDatabase(MONGODB_URI).catch((error) => {
  console.error('Impossibile connettersi al database:', error);
  process.exit(1);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 1 giorno
    },
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      collectionName: 'sessions'
    })
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.messages = req.flash();
  next();
});

app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/todos', todoRoutes);
app.use('/api', apiRoutes);

app.use((req, res) => {
  res.status(404).render('404', {
    title: 'Pagina non trovata'
  });
});

app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  console.error('Errore non gestito:', err);
  res.status(500).render('500', {
    title: 'Errore del server'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server avviato su http://localhost:${PORT}`);
});
