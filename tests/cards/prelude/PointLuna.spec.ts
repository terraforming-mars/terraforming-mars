import {expect} from 'chai';
import {Ants} from '../../../src/cards/base/Ants';
import {EarthCatapult} from '../../../src/cards/base/EarthCatapult';
import {PointLuna} from '../../../src/cards/prelude/PointLuna';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('PointLuna', function() {
  let card : PointLuna; let player : Player; let game : Game;

  beforeEach(function() {
    card = new PointLuna();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
    player.corporationCard = card;
  });

  it('Gets card when earth tag played', function() {
    card.onCardPlayed(player, game, new Ants());
    expect(player.cardsInHand).has.lengthOf(0);

    card.onCardPlayed(player, game, new EarthCatapult());
    expect(player.cardsInHand).has.lengthOf(1);
  });

  it('Should play', function() {
    card.play(player, game);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
