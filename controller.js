

const { v4: uuidv4 } = require('uuid');
const personajes = require('./data');

// ── Validación ────────────────────────────────────────────
function validar(data) {
  const requeridos = ['nombre', 'color_piel', 'raza', 'fuerza', 'agilidad', 'magia', 'conocimiento'];
  for (const campo of requeridos) {
    if (data[campo] === undefined || data[campo] === '') {
      return `El campo "${campo}" es obligatorio.`;
    }
  }
  for (const stat of ['fuerza', 'agilidad', 'magia', 'conocimiento']) {
    const valor = Number(data[stat]);
    if (isNaN(valor) || valor < 1 || valor > 100) {
      return `"${stat}" debe ser un número entre 1 y 100.`;
    }
  }
  return null;
}

// ── Listar todos ──────────────────────────────────────────
function listar(req, res) {
  res.json({ mensaje: "Lista de personajes", total: personajes.length, personajes });
}

// ── Obtener por ID ────────────────────────────────────────
function obtener(req, res) {
  const personaje = personajes.find(p => p.id === req.params.id);
  if (!personaje) return res.status(404).json({ error: "Personaje no encontrado." });
  res.json(personaje);
}

// ── Crear ─────────────────────────────────────────────────
function crear(req, res) {
  const error = validar(req.body);
  if (error) return res.status(400).json({ error });

  const nuevo = {
    id: uuidv4(),
    nombre: req.body.nombre,
    color_piel: req.body.color_piel,
    raza: req.body.raza,
    fuerza: Number(req.body.fuerza),
    agilidad: Number(req.body.agilidad),
    magia: Number(req.body.magia),
    conocimiento: Number(req.body.conocimiento)
  };

  personajes.push(nuevo);
  res.status(201).json({ mensaje: "Personaje creado exitosamente.", personaje: nuevo });
}

// ── Actualizar ────────────────────────────────────────────
function actualizar(req, res) {
  const index = personajes.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Personaje no encontrado." });

  const error = validar(req.body);
  if (error) return res.status(400).json({ error });

  personajes[index] = {
    id: req.params.id,
    nombre: req.body.nombre,
    color_piel: req.body.color_piel,
    raza: req.body.raza,
    fuerza: Number(req.body.fuerza),
    agilidad: Number(req.body.agilidad),
    magia: Number(req.body.magia),
    conocimiento: Number(req.body.conocimiento)
  };

  res.json({ mensaje: "Personaje actualizado exitosamente.", personaje: personajes[index] });
}

// ── Eliminar ──────────────────────────────────────────────
function eliminar(req, res) {
  const index = personajes.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Personaje no encontrado." });

  const eliminado = personajes.splice(index, 1)[0];
  res.json({ mensaje: `Personaje "${eliminado.nombre}" eliminado exitosamente.` });
}

// ── Batalla ───────────────────────────────────────────────
function batalla(req, res) {
  const { id_personaje1, id_personaje2 } = req.body;

  if (!id_personaje1 || !id_personaje2)
    return res.status(400).json({ error: "Se requieren id_personaje1 e id_personaje2." });

  if (id_personaje1 === id_personaje2)
    return res.status(400).json({ error: "Un personaje no puede batirse contra sí mismo." });

  const p1 = personajes.find(p => p.id === id_personaje1);
  const p2 = personajes.find(p => p.id === id_personaje2);

  if (!p1) return res.status(404).json({ error: `Personaje con id "${id_personaje1}" no encontrado.` });
  if (!p2) return res.status(404).json({ error: `Personaje con id "${id_personaje2}" no encontrado.` });

  function calcularPuntaje(p) {
    const base = p.fuerza * 1.5 + p.agilidad * 1.2 + p.magia * 1.4 + p.conocimiento * 1.0;
    const azar = 0.90 + Math.random() * 0.20;
    return Math.round(base * azar);
  }

  const puntaje1 = calcularPuntaje(p1);
  const puntaje2 = calcularPuntaje(p2);

  let resultado, ganador, resumen;

  if (puntaje1 > puntaje2) {
    resultado = "victoria"; ganador = p1.nombre;
    resumen = `${p1.nombre} derrotó a ${p2.nombre} con ${puntaje1 - puntaje2} puntos de ventaja.`;
  } else if (puntaje2 > puntaje1) {
    resultado = "victoria"; ganador = p2.nombre;
    resumen = `${p2.nombre} derrotó a ${p1.nombre} con ${puntaje2 - puntaje1} puntos de ventaja.`;
  } else {
    resultado = "empate"; ganador = null;
    resumen = `Empate con ${puntaje1} puntos cada uno.`;
  }

  res.json({
    mensaje: "¡Batalla completada!",
    resultado,
    ganador,
    puntajes: { [p1.nombre]: puntaje1, [p2.nombre]: puntaje2 },
    detalle: {
      [p1.nombre]: { fuerza: p1.fuerza, agilidad: p1.agilidad, magia: p1.magia, conocimiento: p1.conocimiento },
      [p2.nombre]: { fuerza: p2.fuerza, agilidad: p2.agilidad, magia: p2.magia, conocimiento: p2.conocimiento }
    },
    resumen
  });
}

module.exports = { listar, obtener, crear, actualizar, eliminar, batalla };