
export interface HowToPay {
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

export namespace HowToPay {
  export const EMPTY: Readonly<HowToPay> = {
    heat: 0, megaCredits: 0, steel: 0, titanium: 0, microbes: 0, floaters: 0, science: 0, seeds: 0, data: 0,
  };
  export const keys = Object.keys(EMPTY) as (keyof HowToPay)[];

  export function of(x: Partial<HowToPay>): HowToPay {
    return {
      heat: x.heat ?? 0,
      megaCredits: x.megaCredits ?? 0,
      steel: x.steel ?? 0,
      titanium: x.titanium ?? 0,
      microbes: x.microbes ?? 0,
      floaters: x.floaters ?? 0,
      science: x.science ?? 0,
      seeds: x.seeds ?? 0,
      data: x.data ?? 0,
    };
  }

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
