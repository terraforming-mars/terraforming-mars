import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {runNextAction} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {ProcessorFactory} from '../../../src/server/cards/moon/ProcessorFactory';

describe('ProcessorFactory', () => {
  let player: TestPlayer;
  let card: ProcessorFactory;

  beforeEach(() => {
    [/* game */, player] = testGame(1, {moonExpansion: true});
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
    runNextAction(player.game);

    expect(card.resourceCount).eq(2);
  });
});
