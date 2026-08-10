import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Mogul} from '../../../src/server/awards/modular/Mogul';
import {TestPlayer} from '../../TestPlayer';
import {IMarsBot} from '../../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../../src/server/automa/boards/TharsisMarsBot';

describe('Mogul', () => {
  let award: Mogul;
  let player: TestPlayer;

  it('Counts production', () => {
    award = new Mogul();
    [/* game */, player] = testGame(2);
    expect(award.getScore(player)).to.eq(0);

    player.production.override({steel: 1, titanium: 1, heat: 1});
    expect(award.getScore(player)).to.eq(3);

    player.production.override({steel: 2, titanium: 1, plants: 3, energy: 7, heat: 2});
    expect(award.getScore(player)).to.eq(15);

    player.production.override({megacredits: 1, steel: 1});
    expect(award.getScore(player)).to.eq(1);

    player.production.override({megacredits: -1, steel: 5, heat: 2});
    expect(award.getScore(player)).to.eq(7);
  });

  it('MarsBot scores its most advanced track doubled', () => {
    const award = new Mogul();
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    const bot = {board} as unknown as IMarsBot;
    for (let i = 0; i < 6; i++) {
      board.tracks[3].advance();
    }
    board.tracks[0].advance();

    expect(award.marsBotScore(bot)).to.eq(12);
  });
});
