import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {ProcessorFactory} from '../../../src/cards/moon/ProcessorFactory';
import {expect} from 'chai';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('ProcessorFactory', () => {
  let player: Player;
  let card: ProcessorFactory;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new ProcessorFactory();
  });

  it('can act', () => {
    player.steel = 1;
    expect(card.canAct(player)).is.true;

    player.steel = 0;
    expect(card.canAct(player)).is.false;
  });

  it('act', () => {
    player.steel = 1;
    card.resourceCount = 0;
    card.action(player);
    player.playedCards.push(card);
    expect(player.steel).eq(0);
    TestingUtils.runNextAction(player.game);

    expect(card.resourceCount).eq(2);
  });
});
