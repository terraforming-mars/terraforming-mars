import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {Manufacturer} from '../../../src/server/awards/modular/Manufacturer';
import {TestPlayer} from '../../TestPlayer';
import {IMarsBot} from '../../../src/server/automa/MarsBotCorpTypes';
import {MarsBotBoard} from '../../../src/server/automa/MarsBotBoard';
import {THARSIS_MARSBOT_BOARD} from '../../../src/server/automa/boards/TharsisMarsBot';

describe('Manufacturer', () => {
  let award: Manufacturer;
  let player: TestPlayer;

  it('Counts production', () => {
    award = new Manufacturer();
    [/* game */, player] = testGame(2);
    expect(award.getScore(player)).to.eq(0);

    player.production.override({steel: 1, titanium: 1, heat: 1});
    expect(award.getScore(player)).to.eq(2);

    player.production.override({steel: 2, titanium: 1, plants: 3, energy: 7, heat: 2});
    expect(award.getScore(player)).to.eq(4);

    player.production.override({megacredits: 1, steel: 1});
    expect(award.getScore(player)).to.eq(1);

    player.production.override({megacredits: -1, steel: 5, heat: 2});
    expect(award.getScore(player)).to.eq(7);
  });

  it('MarsBot scores its building and power tracks together', () => {
    const award = new Manufacturer();
    const board = new MarsBotBoard(THARSIS_MARSBOT_BOARD);
    const bot = {board} as unknown as IMarsBot;
    for (let i = 0; i < 3; i++) {
      board.tracks[0].advance();
    }
    board.tracks[4].advance();
    board.tracks[4].advance();

    expect(award.marsBotScore(bot)).to.eq(5);
  });
});
