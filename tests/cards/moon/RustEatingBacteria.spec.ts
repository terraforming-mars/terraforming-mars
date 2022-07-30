import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {RustEatingBacteria} from '../../../src/cards/moon/RustEatingBacteria';
import {expect} from 'chai';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('RustEatingBacteria', () => {
  let player: Player;
  let card: RustEatingBacteria;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player, MOON_OPTIONS);
    card = new RustEatingBacteria();
  });

  it('can act', () => {
    player.steel = 1;
    expect(card.canAct(player)).is.true;

    player.steel = 0;
    expect(card.canAct(player)).is.false;
  });

  it('action', () => {
    player.steel = 1;
    card.resourceCount = 0;
    card.action(player);
    expect(card.resourceCount).eq(2);
    expect(player.steel).eq(0);
  });
});

