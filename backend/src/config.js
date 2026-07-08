// Configuracion central del backend
module.exports = {
  port: process.env.PORT || 3000,
  // Cantidad por defecto (kg) que se "sirve" en cada pulsacion del boton
  // en el frontend. Se puede sobreescribir enviando { amount } en el POST.
  defaultFeedAmounts: {
    cerdos: 5,
    pollos: 1.5,
    vacas: 10,
  },
  // Limite maximo aceptado por pulsacion (sanidad)
  maxFeedAmount: 500,
  animals: ['cerdos', 'pollos', 'vacas'],
  // Etiquetas legibles para el frontend
  animalLabels: {
    cerdos: { es: 'Cerdos', en: 'Pigs' },
    pollos: { es: 'Pollos', en: 'Chickens' },
    vacas: { es: 'Vacas', en: 'Cows' },
  },
};
