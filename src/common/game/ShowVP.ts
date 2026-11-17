export type ShowVP =
  'none' |
  'yours' | // showOtherPlayersVP = false
  'all'; // showOtherPlayersVP = true

export const SHOW_VP_VALUES: ReadonlyArray<ShowVP> = ['none', 'yours', 'all'];

export function isShowVP(val: unknown): val is ShowVP {
  return (SHOW_VP_VALUES as ReadonlyArray<unknown>).includes(val);
}

/** Converts the deprecated boolean `showOtherPlayersVP` option into its `ShowVP` equivalent. */
export function showVPFromLegacy(showOtherPlayersVP: boolean | undefined): ShowVP {
  return showOtherPlayersVP === true ? 'all' : 'yours';
}
