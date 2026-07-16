import {expect} from 'chai';
import {cast, churn} from '../../TestingUtils';
import {AsteroidHollowing} from '../../../src/server/cards/promo/AsteroidHollowing';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('AsteroidHollowing', () => {
  let card: AsteroidHollowing;
  let player: TestPlayer;

  beforeEach(() => {
    card = new AsteroidHollowing();
    [/* game */, player] = testGame(2);
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
  });

  it('Can not act', () => {
    player.playedCards.push(card);
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', () => {
    player.titanium = 1;

    expect(card.canAct(player)).is.true;
    expect(churn(card.action(player), player)).is.undefined;

    expect(player.titanium).to.eq(0);
    expect(card.resourceCount).to.eq(1);
    expect(player.production.megacredits).to.eq(1);
  });

  it('Should give victory points', () => {
    player.playedCards.push(card);
    player.titanium = 2;

    expect(churn(card.action(player), player)).is.undefined;
    expect(card.getVictoryPoints(player)).to.eq(0);

    expect(churn(card.action(player), player)).eq(undefined);

    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
