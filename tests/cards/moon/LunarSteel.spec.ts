import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {LunarSteel} from '../../../src/server/cards/moon/LunarSteel';
import {expect} from 'chai';

describe('LunarSteel', () => {
  let player: Player;
  let card: LunarSteel;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    card = new LunarSteel();
  });

  it('play', () => {
    expect(player.getSteelValue()).to.eq(2);
    card.play(player);
    expect(player.getSteelValue()).to.eq(3);
  });
});

