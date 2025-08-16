const express = require('express');
const logger  = require('./logger'); // Import the logger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const usersRouter = require('./users'); // Import the users router
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3001;
const app = express();

const swaggerDocument = YAML.load('./swagger.yaml');
//Enable JSON parsing for JSON requests
app.use(express.json());
//Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const server = app.listen(PORT, () => {
  logger.info(` ✅ Server running at http://localhost:${PORT}`);
  console.log(` ✅ Swagger docs available at http://localhost:${PORT}/api-docs`);
}).on ('error', (err) => {
  logger.error(` ❌ Error starting server: ${err.message}`);
});

//Create a shutdown handler:
function gracefulShutdown() {
  logger.info('🛑 Initiating graceful shutdown...');

  server.close(() => {
    logger.info('✅ HTTP server closed');

    // Example: Close PostgreSQL DB connection
    //pgClient.end(() => {
    //  logger.info('✅ PostgreSQL client disconnected');
    //});

    process.exit(0);
  });

  // Optional: Force exit if shutdown takes too long
  setTimeout(() => {
    logger.info('⏱️ Shutdown timeout — forcing exit');
    process.exit(1);
  }, 10000); // 10 seconds
}


//Mount the users router
app.use('/users', usersRouter); 

app.get('/hello', (req, res) => {
  logger.info('GET, Hello endpoint was called');
  res.send('Hello world!');
});

app.get('/shutdown', (req, res) => {
  const token = req.query.token;
  if (token !== 'mySecretToken') {
    logger.error(' ❌ Shutdown attempt with incorect token');
    return res.status(403).send(' ❌ Token incorectt or missing');
  }
  logger.warn ('Server is shutting down');
  res.send('Server is shutting down...');
  // Delay shutdown to allow response to complete
  setTimeout(gracefulShutdown(), 100);
});

// Middleware to handle JSON requests
