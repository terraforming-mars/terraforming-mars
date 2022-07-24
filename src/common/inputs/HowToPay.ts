
export type HowToPay = {
  heat: number;
  megaCredits: number;
  steel: number;
  titanium: number;
  microbes: number;
  floaters: number;
  science: number;
  seeds: number;
  data: number;
}

export const EMPTY_HOWTOPAY: HowToPay = {
  heat: 0,
  megaCredits: 0,
  steel: 0,
  titanium: 0,
  microbes: 0,
  floaters: 0,
  science: 0,
  seeds: 0,
  data: 0,
} as const;
