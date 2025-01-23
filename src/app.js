const express = require('express')
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const carparksRouter = require('./routes/carparks');
const usersRouter = require('./routes/users');

const app = express()
// Middleware to parse JSON requests
app.use(express.json());

const port = 3000

// Swagger definition options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Carpark Info API',
      version: '1.0.0',
      description: 'This is a POC API for carpark information for the Handshakes interview assignment',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  // Path to the API docs (use JSDoc comments in these files)
  apis: ['./routes/*.js'], // Point to your route files
};

// Generate swagger docs
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use the routes
app.use('/api/carparks', carparksRouter);
app.use('/api/users', usersRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})