import {expect} from 'chai';
import {Ants} from '../../../src/server/cards/base/Ants';
import {EarthCatapult} from '../../../src/server/cards/base/EarthCatapult';
import {PointLuna} from '../../../src/server/cards/prelude/PointLuna';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

describe('PointLuna', function() {
  let card: PointLuna;
  let player: TestPlayer;

  beforeEach(function() {
    card = new PointLuna();
    [/* game */, player] = testGame(1);
    player.setCorporationForTest(card);
  });

  it('Gets card when earth tag played', function() {
    card.onCardPlayed(player, new Ants());
    expect(player.cardsInHand).has.lengthOf(0);

    card.onCardPlayed(player, new EarthCatapult());
    expect(player.cardsInHand).has.lengthOf(1);
  });

  it('Should play', function() {
    card.play(player);
    expect(player.production.titanium).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
