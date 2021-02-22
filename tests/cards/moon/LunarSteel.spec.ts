import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
import {LunarSteel} from '../../../src/cards/moon/LunarSteel';
import {expect} from 'chai';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('LunarSteel', () => {
  let player: Player;
  let card: LunarSteel;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new LunarSteel();
  });

  it('play', () => {
    expect(player.getSteelValue()).to.eq(2);
    card.play(player);
    expect(player.getSteelValue()).to.eq(3);
  });
});

