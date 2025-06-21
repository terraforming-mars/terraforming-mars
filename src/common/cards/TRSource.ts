export const TR_SOURCES = [
  'oxygen',
  'temperature',
  'oceans',
  'tr',
  'venus',
  'moonHabitat',
  'moonMining',
  'moonLogistics',
] as const;

// TRSource represents the ways an action will gain TR. This is used
// exclusively to compute tax when Reds are in power.
export type TRSource = Partial<{
  oxygen: number,
  temperature: number,
  oceans: number,
  tr: number,
  venus: number
  moonHabitat: number,
  moonMining: number,
  moonLogistics: number,
}>
