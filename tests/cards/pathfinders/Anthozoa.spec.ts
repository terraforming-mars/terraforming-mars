import {expect} from 'chai';
import {Anthozoa} from '../../../src/server/cards/pathfinders/Anthozoa';
import {TestPlayer} from '../../TestPlayer';
import {addOcean, testGame} from '../../TestingUtils';

describe('Anthozoa', () => {
  let card: Anthozoa;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Anthozoa();
    [/* game */, player] = testGame(1);
  });

  it('canPlay', () => {
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;
    addOcean(player);
    expect(player.canPlay(card)).is.false;
    addOcean(player);
    expect(player.canPlay(card)).is.false;
    addOcean(player);
    expect(player.canPlay(card)).is.true;
  });

  it('canAct', () => {
    expect(card.canAct(player)).is.false;
    player.plants = 1;
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    player.plants = 1;
    expect(card.resourceCount).eq(0);

    card.action(player);

    expect(player.plants).eq(0);
    expect(card.resourceCount).eq(1);
  });

  it('getVictoryPoints', () => {
    card.resourceCount = 1;
    expect(card.getVictoryPoints(player)).eq(0);
    card.resourceCount = 2;
    expect(card.getVictoryPoints(player)).eq(1);
    card.resourceCount = 3;
    expect(card.getVictoryPoints(player)).eq(1);
    card.resourceCount = 4;
    expect(card.getVictoryPoints(player)).eq(2);
  });
});
