const express = require('express');
const router = express.Router();
const controller = require('./controller');
 
// ── Personajes ────────────────────────────────────────────
router.get('/personajes',        controller.listar);
router.get('/personajes/:id',    controller.obtener);
router.post('/personajes',       controller.crear);
router.put('/personajes/:id',    controller.actualizar);
router.delete('/personajes/:id', controller.eliminar);
 
// ── Batalla ───────────────────────────────────────────────
router.post('/batalla', controller.batalla);
 
module.exports = router;