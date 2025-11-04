const mongoose = require('mongoose');

async function connectDatabase(uri) {
  if (!uri) {
    throw new Error("La variabile d'ambiente MONGODB_URI non è definita.");
  }

  mongoose.connection.on('connected', () => {
    console.log('✅ Connessione a MongoDB stabilita');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ Errore di connessione a MongoDB:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ Connessione a MongoDB terminata');
  });

  await mongoose.connect(uri, {
    autoIndex: true
  });

  return mongoose.connection;
}

module.exports = {
  connectDatabase
};
