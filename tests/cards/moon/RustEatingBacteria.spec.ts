import {Game} from '../../../src/server/Game';
import {runAllActions, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {RustEatingBacteria} from '../../../src/server/cards/moon/RustEatingBacteria';
import {expect} from 'chai';

describe('RustEatingBacteria', () => {
  let player: TestPlayer;
  let card: RustEatingBacteria;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
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
    runAllActions(player.game);
    expect(card.resourceCount).eq(2);
    expect(player.steel).eq(0);
  });
});

