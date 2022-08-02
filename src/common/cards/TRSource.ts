// TRSource represents the ways an action will gain TR. This is used
// exclusively to compute tax when Reds are in power.
export interface TRSource {
  oxygen?: number,
  temperature?: number,
  oceans?: number,
  tr?: number,
  venus?: number
  moonColony?: number,
  moonMining?: number,
  moonLogistics?: number,
}
