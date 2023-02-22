/*
 * Index representing the nth player in the game.
 */
export type PlayerIndex = 0 | 1 | 2 | 3 | 4 | 5;

/*
 * Attributes representing UI components that can have their visibility toggled.
 */
export type Toggleable =
  'milestones' |
  'awards_list' |
  'tags_concise' |
  `pinned_player_${PlayerIndex}` |
  'turmoil_parties';
