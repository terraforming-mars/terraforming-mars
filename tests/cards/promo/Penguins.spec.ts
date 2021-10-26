import {expect} from 'chai';
import {Penguins} from '../../../src/cards/promo/Penguins';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('Penguins', function() {
  let card : Penguins; let player : Player;

  beforeEach(function() {
    card = new Penguins();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
  });

  it('Can\'t play', function() {
    TestingUtils.maxOutOceans(player, 7);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    TestingUtils.maxOutOceans(player, 8);
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    expect(card.canAct()).is.true;
    card.action(player);
    expect(card.resourceCount).to.eq(1);
  });

  it('Should give victory points', function() {
    player.playedCards.push(card);
    card.action(player);
    card.action(player);
    expect(card.getVictoryPoints()).to.eq(2);
  });
});
