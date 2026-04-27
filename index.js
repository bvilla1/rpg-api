const express = require('express');
const routes = require('./routes');

const app = express();
app.use(express.json());
app.use('/', routes);

const PUERTO = 3000;
app.listen(PUERTO, () => {
  console.log(`\nAPI RPG corriendo en http://localhost:${PUERTO}`);
  console.log('\nEndpoints disponibles:');
  console.log('  GET    /personajes');
  console.log('  GET    /personajes/:id');
  console.log('  POST   /personajes');
  console.log('  PUT    /personajes/:id');
  console.log('  DELETE /personajes/:id');
  console.log('  POST   /batalla\n');
});
