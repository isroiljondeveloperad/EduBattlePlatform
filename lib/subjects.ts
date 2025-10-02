export const SUBJECTS = [
  "Ona tili va adabiyot (O'zbek tili)",
  "Rus tili (va adabiyoti)",
  "Ingliz tili",
  "Matematika",
  "Informatika va axborot texnologiyalari",
  "Fizika",
  "Kimyo",
  "Biologiya",
  "Tarix (O'zbekiston tarixi va Jahon tarixi)",
  "Geografiya",
  "Texnologiya (mehnat darsi)",
  "Musiqa",
  "Jismoniy tarbiya",
  "Huquq asoslari",
  "Ma'naviyat va ma'rifat",
  "Davlat va jamiyat asoslari (DSA)",
  "Hayot faoliyati xavfsizligi asoslari (HFHA)",
] as const

export type Subject = (typeof SUBJECTS)[number]
