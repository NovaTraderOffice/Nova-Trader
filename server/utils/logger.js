const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    // Salvează erorile critice în error.log
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // Salvează totul în combined.log
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Dacă nu suntem în producție, afișăm și în consolă colorat
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;