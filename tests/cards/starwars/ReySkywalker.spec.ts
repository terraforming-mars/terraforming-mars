// import {expect} from 'chai';
import {ReySkywalker} from '../../../src/server/cards/starwars/ReySkywalker';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('ReySkywalker', () => {
  let card: ReySkywalker;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new ReySkywalker();
    [game, player, player2] = testGame(2, {starWarsExpansion: true});
  });

  it('Can play, invalid test', () => {
    console.log('ignoring this test for now', card, player, player2, game);
  });
});
