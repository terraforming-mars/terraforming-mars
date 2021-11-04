import {expect} from 'chai';
import {Anthozoa} from '../../../src/cards/pathfinders/Anthozoa';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
// import {Units} from '../../../src/Units';
import {TestingUtils} from '../../TestingUtils';

describe('Anthozoa', function() {
  let card: Anthozoa;
  let player: TestPlayer;

  beforeEach(function() {
    card = new Anthozoa();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('canPlay', function() {
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;
    TestingUtils.addOcean(player);
    expect(player.canPlay(card)).is.false;
    TestingUtils.addOcean(player);
    expect(player.canPlay(card)).is.false;
    TestingUtils.addOcean(player);
    expect(player.canPlay(card)).is.true;
  });

  it('canAct', function() {
    expect(card.canAct(player)).is.false;
    player.plants = 1;
    expect(card.canAct(player)).is.true;
  });

  it('action', function() {
    player.plants = 1;
    expect(card.resourceCount).eq(0);

    card.action(player);

    expect(player.plants).eq(0);
    expect(card.resourceCount).eq(1);
  });

  it('getVictoryPoints', function() {
    card.resourceCount = 1;
    expect(card.getVictoryPoints()).eq(0);
    card.resourceCount = 2;
    expect(card.getVictoryPoints()).eq(1);
    card.resourceCount = 3;
    expect(card.getVictoryPoints()).eq(1);
    card.resourceCount = 4;
    expect(card.getVictoryPoints()).eq(2);
  });
});
