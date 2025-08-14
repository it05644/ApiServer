const express = require('express');
const logger  = require('./logger'); // Import the logger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/hello', (req, res) => {
  logger.info('GET, Hello endpoint was called');
  res.send('Hello world!');
});

app.get('/shutdown', (req, res) => {
  const token = req.query.token;
  if (token !== 'mySecretToken') {
    logger.error(' ❌ Shutdown attempt with incorrect token');
    return res.status(403).send(' ❌ Token incorectt or missing');
  }
  logger.warn ('Server is shutting down');
  res.send('Server is shutting down...');
  process.exit(0);
});

// Middleware to handle JSON requests
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info(` ✅ Server running at http://localhost:${PORT}`);
  console.log(` ✅ Swagger docs available at http://localhost:${PORT}/api-docs`);
}).on ('error', (err) => {
  logger.error(` ❌ Error starting server: ${err.message}`);
});
// server.js on new branch