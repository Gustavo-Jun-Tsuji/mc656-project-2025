// Tags that can be selected by the user when creating/filtering routes
const TAGS = [
  "sombra",
  "cênica",
  "curta",
  "longa",
  "histórica",
  "plana",
  "subida",
  "descida",
  "ciclovia",
  "parque",
  "movimentada",
  "tranquila",
  "lazer",
  "cultural",
  "caminhada",
  "corrida",
  "passeio",
  "natureza",
];

export const TAG_OPTIONS = [...TAGS].sort((a, b) => a.localeCompare(b, "pt-BR"));
export default TAG_OPTIONS;