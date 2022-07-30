import {expect} from 'chai';
import {Ants} from '../../../src/cards/base/Ants';
import {EarthCatapult} from '../../../src/cards/base/EarthCatapult';
import {PointLuna} from '../../../src/cards/prelude/PointLuna';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('PointLuna', function() {
  let card: PointLuna;
  let player: TestPlayer;

  beforeEach(function() {
    card = new PointLuna();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
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
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
