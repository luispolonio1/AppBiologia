// Configuracion visual y semantica de los animales.
export const ANIMALS = [
  {
    id: 'cerdos',
    label: 'Cerdos',
    english: 'Pigs',
    emoji: '🐖',
    color: '#f4a4a4', // rosado suave para cerdo
    accent: '#d64545',
    defaultAmount: 5, // kg
    image: require('../../assets/pig.png'),
  },
  {
    id: 'pollos',
    label: 'Pollos',
    english: 'Chickens',
    emoji: '🐔',
    color: '#f7d774', // amarillo suave
    accent: '#e0a200',
    defaultAmount: 1.5,
    image: require('../../assets/chicken.png'),
  },
  {
    id: 'vacas',
    label: 'Vacas',
    english: 'Cows',
    emoji: '🐄',
    color: '#cfe2b4', // verde muy claro
    accent: '#5e8a18',
    defaultAmount: 10,
    image: require('../../assets/cow.png'),
  },
];

export const ANIMALS_BY_ID = Object.fromEntries(ANIMALS.map((a) => [a.id, a]));
