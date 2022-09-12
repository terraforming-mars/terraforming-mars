// in-place shuffle using the Fisher-Yates algorithm..
// See https://bost.ocks.org/mike/shuffle/ for details.

import {Random} from '../Random';

export function inplaceShuffle(array: Array<any>, rng: Random) {
  let last = array.length;

  // While there remain elements to shuffle…
  while (last > 0) {
    // Pick a remaining element…
    const idx = rng.nextInt(last);
    last--;

    // And swap it with the current element.
    const temp = array[last];
    array[last] = array[idx];
    array[idx] = temp;
  }
}
