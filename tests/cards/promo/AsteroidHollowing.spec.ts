import {expect} from 'chai';
import {AsteroidHollowing} from '../../../src/cards/promo/AsteroidHollowing';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('AsteroidHollowing', function() {
  let card : AsteroidHollowing; let player : Player;

  beforeEach(function() {
    card = new AsteroidHollowing();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    expect(card.play()).is.undefined;
  });

  it('Can\'t act', function() {
    player.playedCards.push(card);
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.titanium = 1;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.titanium).to.eq(0);
    expect(card.resourceCount).to.eq(1);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });

  it('Should give victory points', function() {
    player.playedCards.push(card);
    player.titanium = 2;

    card.action(player);
    expect(card.getVictoryPoints()).to.eq(0);

    card.action(player);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
