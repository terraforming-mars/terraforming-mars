import {expect} from 'chai';
import {Ants} from '../../../src/server/cards/base/Ants';
import {EarthCatapult} from '../../../src/server/cards/base/EarthCatapult';
import {PointLuna} from '../../../src/server/cards/prelude/PointLuna';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

describe('PointLuna', () => {
  let card: PointLuna;
  let player: TestPlayer;

  beforeEach(() => {
    card = new PointLuna();
    [/* game */, player] = testGame(1);
  });

  it('Gets card when earth tag played', () => {
    player.playedCards.push(card);
    card.onCardPlayedForCorps(player, new Ants());
    expect(player.cardsInHand).has.lengthOf(0);

    card.onCardPlayedForCorps(player, new EarthCatapult());
    expect(player.cardsInHand).has.lengthOf(1);
  });

  it('Should play', () => {
    player.playCorporationCard(card);
    expect(player.production.titanium).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
