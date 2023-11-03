import {expect} from 'chai';
import {churnAction} from '../../TestingUtils';
import {AsteroidHollowing} from '../../../src/server/cards/promo/AsteroidHollowing';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('AsteroidHollowing', function() {
  let card: AsteroidHollowing;
  let player: TestPlayer;

  beforeEach(function() {
    card = new AsteroidHollowing();
    [/* game */, player] = testGame(2);
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
    expect(churnAction(card, player)).is.undefined;

    expect(player.titanium).to.eq(0);
    expect(card.resourceCount).to.eq(1);
    expect(player.production.megacredits).to.eq(1);
  });

  it('Should give victory points', function() {
    player.playedCards.push(card);
    player.titanium = 2;

    expect(churnAction(card, player)).is.undefined;
    expect(card.getVictoryPoints(player)).to.eq(0);

    expect(churnAction(card, player)).eq(undefined);

    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
