export type Payment = {
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

export namespace Payment {
  export const EMPTY: Readonly<Payment> = {
    heat: 0, megaCredits: 0, steel: 0, titanium: 0, microbes: 0, floaters: 0, science: 0, seeds: 0, data: 0,
  } as const;
  export const keys = Object.keys(EMPTY) as (keyof Payment)[];

  export interface Options {
    steel: boolean,
    titanium: boolean,
    floaters: boolean,
    microbes: boolean,
    science: boolean,
    seeds: boolean,
    data: boolean,
  }
}
