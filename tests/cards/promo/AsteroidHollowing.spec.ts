import {expect} from 'chai';
import {AsteroidHollowing} from '../../../src/server/cards/promo/AsteroidHollowing';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('AsteroidHollowing', function() {
  let card: AsteroidHollowing;
  let player: Player;

  beforeEach(function() {
    card = new AsteroidHollowing();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play', function() {
    expect(card.play(player)).is.undefined;
  });

  it('Can not act', function() {
    player.playedCards.push(card);
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', function() {
    player.titanium = 1;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.titanium).to.eq(0);
    expect(card.resourceCount).to.eq(1);
    expect(player.production.megacredits).to.eq(1);
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
